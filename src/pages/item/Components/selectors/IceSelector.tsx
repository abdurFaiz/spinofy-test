import { Checkbox } from "@/components/ui/checkbox";

interface OptionData {
  id: number;
  name: string;
  extra_price: number;
}

interface Props {
  readonly selected: Set<string>;
  readonly toggle: (
    setFn: (v: Set<string>) => void,
    current: Set<string>,
    value: string,
  ) => void;
  readonly options?: OptionData[];
}

export default function IceSelector({ selected, toggle, options: apiOptions }: Props) {
  const defaultOptions = [
    { id: "normal", label: "Normal Ice", extra_price: 0 },
    { id: "less", label: "Less Ice", extra_price: 0 },
    { id: "more", label: "More Ice", extra_price: 0 },
  ];

  // Use API options if available, otherwise fall back to defaults
  const options = apiOptions?.length
    ? apiOptions.map(opt => ({
      id: opt.name.toLowerCase(),
      label: opt.name,
      extra_price: opt.extra_price
    }))
    : defaultOptions;

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-medium font-rubik capitalize">
        Ice Cube <span className="text-dark-red">*</span>
      </h2>

      <div className="flex flex-col mt-2">
        {options.map(({ id, label, extra_price }, idx) => (
          <button
            key={id}
            onClick={() => toggle(() => { }, selected, id)}
            className={`cursor-pointer flex items-center justify-between py-4 px-4 ${idx === options.length - 1 ? "" : "border-b border-body/20"
              }`}
          >
            <div className="flex flex-col items-start">
              <span className="text-base font-rubik capitalize text-title-black">
                {label}
              </span>
              {extra_price > 0 && (
                <span className="text-sm text-gray-500">
                  +Rp {extra_price.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            <Checkbox
              checked={selected.has(id)}
              className="data-[state=checked]:bg-primary-orange data-[state=checked]:border-primary-orange"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
