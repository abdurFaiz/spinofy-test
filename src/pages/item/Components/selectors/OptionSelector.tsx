import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  selected: Set<string>;
  toggle: (
    setFn: (v: Set<string>) => void,
    current: Set<string>,
    value: string,
  ) => void;
}

export default function OptionSelector({ selected, toggle }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-rubik font-medium capitalize">
        <span className="text-title-black">Pilihan Tersedia</span>
        <span className="text-dark-red">*</span>
      </h2>

      <div className="flex items-center gap-3">
        <button
          onClick={() => toggle(() => {}, selected, "cold")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-full border transition-colors
            ${selected.has("cold") ? "border-primary-orange bg-primary-orange/10" : "border-body-grey bg-transparent"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="#F35F0F"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 7h16m-1.8 4l.8-4l-.8-4c-.1-.5-.6-1-1.2-1H7c-.6 0-1.1.4-1.2 1C5.5 4.4 5 7 5 7l.8 4M18 18H6l-1-7h14ZM7.2 18l.6 3c.1.5.6 1 1.2 1h6c.6 0 1.1-.4 1.2-1l.6-3"
            />
          </svg>
          <span
            className={`text-base capitalize ${selected.has("cold") ? "text-primary-orange" : "text-body-grey"}`}
          >
            Cold
          </span>
          <Checkbox
            checked={selected.has("cold")}
            className="ml-2 data-[state=checked]:bg-primary-orange data-[state=checked]:border-primary-orange"
          />
        </button>

        <button
          onClick={() => toggle(() => {}, selected, "hot")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-full border transition-colors
            ${selected.has("hot") ? "border-primary-orange bg-primary-orange/10" : "border-body-grey bg-transparent"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 48 48"
          >
            <g
              fill="none"
              stroke="#F35F0F"
              stroke-linejoin="round"
              stroke-width="4"
            >
              <path d="M10 31s.071 6 14 6s14-6 14-6V15H10z" />
              <path
                stroke-linecap="round"
                d="M24 4v6m-8-5v4m16-4v4M14 36v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5"
              />
            </g>
          </svg>
          <span
            className={`text-base capitalize ${selected.has("hot") ? "text-primary-orange" : "text-body-grey"}`}
          >
            Hot
          </span>
          <Checkbox
            checked={selected.has("hot")}
            className="ml-2 data-[state=checked]:bg-primary-orange data-[state=checked]:border-primary-orange"
          />
        </button>
      </div>
    </div>
  );
}
