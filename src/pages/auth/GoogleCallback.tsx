import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const login = useAuthStore((state) => state.login);

    const handleTokensFromUrl = (token: string, refreshToken: string, userId?: string, userName?: string, userEmail?: string) => {
        console.log('Received tokens from URL redirect');

        // Create user object if we have data
        const user = userId && userName ? {
            id: Number.parseInt(userId, 10),
            uuid: userId, // Use ID as UUID fallback
            name: userName,
            phone: userEmail || '', // Use email as phone fallback
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            customer_profile: {
                id: Number.parseInt(userId, 10),
                uuid: userId,
                job: null,
                date_birth: null,
                gender: null,
                user_id: Number.parseInt(userId, 10),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        } : null;

        if (user) {
            // Use auth store login method
            login({
                access_token: token,
                refresh_token: refreshToken,
                user
            });
        } else {
            // Just store tokens if no user data
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', refreshToken);
        }

        // Force navigation to frontend URL to prevent staying on backend domain
        const frontendUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5174';
        const homeUrl = `${frontendUrl}/home`;
        console.log('🚀 Force redirecting to:', homeUrl);
        globalThis.location.href = homeUrl;
    };

    const handleOAuthCode = async (code: string) => {
        console.log('Using OAuth code to get tokens:', code);

        try {
            const response = await authAPI.handleGoogleCallback(code);
            console.log('OAuth callback response:', response);

            if (response.status === 'success' && response.data) {
                const { access_token, refresh_token, user } = response.data;

                // Use auth store login method with proper data structure
                login({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    user: user
                });

                console.log('Successfully logged in, redirecting to home');
                
                // Force navigation to frontend URL to prevent staying on backend domain
                const frontendUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5174';
                const homeUrl = `${frontendUrl}/home`;
                console.log('🚀 Force redirecting to:', homeUrl);
                globalThis.location.href = homeUrl;
            } else {
                throw new Error(response.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Error in handleOAuthCode:', error);
            throw error;
        }
    };

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                console.log('=== Google Callback Debug ===');
                console.log('Current URL:', globalThis.location.href);
                console.log('Current Origin:', globalThis.location.origin);
                console.log('Expected Frontend URL:', import.meta.env.VITE_APP_URL || 'http://localhost:5174');
                console.log('URL Search Params:', Object.fromEntries(searchParams.entries()));

                // Check for OAuth error first
                const oauthError = searchParams.get('error');
                if (oauthError) {
                    console.error('OAuth error from URL:', oauthError);
                    throw new Error(`Google OAuth error: ${oauthError}`);
                }

                // Check if we have tokens directly from URL (Laravel redirect)
                const token = searchParams.get('access_token') || searchParams.get('token');
                const refreshToken = searchParams.get('refresh_token');

                console.log('Tokens from URL - Access:', !!token, 'Refresh:', !!refreshToken);

                if (token && refreshToken) {
                    // Direct token approach - Laravel sent tokens directly
                    console.log('Using direct token approach');
                    const userId = searchParams.get('user_id');
                    const userName = searchParams.get('user_name');
                    const userPhone = searchParams.get('user_phone') || searchParams.get('user_email');

                    handleTokensFromUrl(token, refreshToken, userId || undefined, userName || undefined, userPhone || undefined);
                } else {
                    // OAuth code approach - need to exchange code for tokens
                    const code = searchParams.get('code');
                    const state = searchParams.get('state');

                    console.log('OAuth Code:', !!code, 'State:', !!state);

                    if (!code) {
                        console.error('No authorization code or tokens found in URL');
                        console.log('Available params:', Object.fromEntries(searchParams.entries()));
                        throw new Error('No authorization code or tokens received from OAuth callback');
                    }

                    console.log('Using OAuth code exchange approach');
                    await handleOAuthCode(code);
                }
            } catch (err) {
                console.error('Google callback error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');

                // Redirect to onboard page after a delay
                setTimeout(() => {
                    navigate('/onboard', { replace: true });
                }, 5000); // Give more time to see the error
            } finally {
                setIsLoading(false);
            }
        };

        // Add a small delay to ensure the URL is fully loaded
        const timeoutId = setTimeout(handleGoogleCallback, 100);
        return () => clearTimeout(timeoutId);
    }, [searchParams, navigate, login]);

    if (isLoading) {
        return (
            <ScreenWrapper>
                <div className="flex flex-col items-center justify-center h-screen gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
                    <p className="text-body-grey">Menyelesaikan login dengan Google...</p>
                </div>
            </ScreenWrapper>
        );
    }

    if (error) {
        return (
            <ScreenWrapper>
                <div className="flex flex-col items-center justify-center h-screen gap-4 px-4">
                    <div className="text-red-500 text-center">
                        <h2 className="text-xl font-bold mb-2">Login Gagal</h2>
                        <p className="text-sm">{error}</p>
                    </div>
                    <p className="text-body-grey text-sm text-center">
                        Akan kembali ke halaman utama dalam beberapa detik...
                    </p>
                </div>
            </ScreenWrapper>
        );
    }

    return null;
};

export default GoogleCallback;