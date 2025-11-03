import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  selected: Set<string>;
  toggle: (
    setFn: (v: Set<string>) => void,
    current: Set<string>,
    value: string,
  ) => void;
}

export default function SizeSelector({ selected, toggle }: Props) {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-medium font-rubik capitalize">
        Ukuran Cup <span className="text-dark-red">*</span>
      </h2>
      <div className="flex flex-col mt-2">
        {["regular", "large"].map((size) => (
          <button
            key={size}
            onClick={() => toggle(() => {}, selected, size)}
            className={`cursor-pointer flex items-center justify-between py-4 px-4 ${
              size === "regular" ? "border-b border-body/20" : ""
            }`}
          >
            <span className="text-base font-rubik capitalize text-title">
              {size === "regular" ? "Reguler Cold" : "Large Cold"}
            </span>
            <div className="flex items-center gap-3">
              {size === "large" && (
                <span className="text-sm text-primary-orange">+Rp 5.000</span>
              )}
              <Checkbox
                checked={selected.has(size)}
                className="data-[state=checked]:bg-primary-orange data-[state=checked]:border-primary-orange"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
