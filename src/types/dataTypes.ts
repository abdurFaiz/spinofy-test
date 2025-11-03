export interface UserInfo {
    name: string;
    vouchers: number;
    points: number;
    table: string;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
}

export interface MenuSection {
    id: string;
    title: string;
    items: MenuItem[];
}

export interface MockData {
    user: UserInfo;
    heroImages: string[];
    categories: string[];
    recommendations: MenuItem[];
    menuSections: MenuSection[];
}
