interface Props {
    value: string;
    onChange: (v: string) => void;
}

export default function NotesInput({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium capitalize font-rubik text-title-black">
                Notes
            </h2>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Tambahan Catatan Disini"
                className="w-full cursor-pointer h-[166px] px-4 py-4 rounded-3xl border border-title-black/20 bg-white text-base text-title-black placeholder:text-title-black resize-none focus:outline-none focus:ring-2 focus:ring-primary-orange/20"
            />
        </div>
    );
}
