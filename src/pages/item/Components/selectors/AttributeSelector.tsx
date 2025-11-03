import { Checkbox } from "@/components/ui/checkbox";
import type { ProductAttribute } from "@/types/DetailProduct";

interface Props {
    readonly attribute: ProductAttribute;
    readonly selected: Set<string>;
    readonly toggle: (
        setFn: (v: Set<string>) => void,
        current: Set<string>,
        value: string,
    ) => void;
}

export default function AttributeSelector({ attribute, selected, toggle }: Props) {
    const isRadio = attribute.display_type === 1; // 1 = radio (single select), 2 = checkbox (multi select)

    const handleSelect = (valueId: string) => {
        if (isRadio) {
            // For radio, clear all and set only the selected one
            toggle(() => { }, new Set([valueId]), valueId);
        } else {
            // For checkbox, toggle the value
            toggle(() => { }, selected, valueId);
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-lg font-medium font-rubik capitalize">
                {attribute.name} <span className="text-dark-red">*</span>
            </h2>

            <div className="flex flex-col mt-2">
                {attribute.values.map((value, idx) => {
                    const valueKey = `${attribute.id}-${value.id}`;
                    const isSelected = selected.has(valueKey);

                    return (
                        <button
                            key={valueKey}
                            onClick={() => handleSelect(valueKey)}
                            className={`cursor-pointer flex items-center justify-between py-4 px-4 ${idx === attribute.values.length - 1 ? "" : "border-b border-body/20"
                                }`}
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-base font-rubik capitalize text-title-black">
                                    {value.name}
                                </span>
                                {value.extra_price > 0 && (
                                    <span className="text-sm text-body-grey">
                                        +Rp {value.extra_price.toLocaleString('id-ID')}
                                    </span>
                                )}
                            </div>
                            <Checkbox
                                checked={isSelected}
                                className="pointer-events-none"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
