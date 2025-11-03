import { ItemDetails } from "./ItemDetails";
import { EditButton } from "./EditButton";
import { ItemImage } from "./ItemImage";
import { ItemPrice } from "./ItemPrice";
import { QuantityControl } from "./QuantityControl";

export interface OrderItemProps {
  name: string;
  notes?: string | null;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  ice?: string;
  options?: string[];
  onQuantityChange: (delta: number) => void;
  onEdit: () => void;
  isLastItem?: boolean;
}

export function OrderItemCard({
  name,
  notes,
  price,
  image,
  quantity,
  size,
  ice,
  options,
  onQuantityChange,
  onEdit,
  isLastItem = false,
}: OrderItemProps) {
  return (
    <div
      className={`flex flex-col ${!isLastItem ? "border-b border-dashed border-body-grey/25 pb-3" : "pb-3"}`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start pb-3">
        <div className="flex flex-col gap-9 w-28">
          <ItemDetails
            name={name}
            notes={notes}
            size={size}
            ice={ice}
            options={options}
          />
          <EditButton onClick={onEdit} />
        </div>
        <ItemImage src={image} alt={name} />
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        <ItemPrice price={price} />
        <QuantityControl
          quantity={quantity}
          onDecrease={() => onQuantityChange(-1)}
          onIncrease={() => onQuantityChange(1)}
        />
      </div>
    </div>
  );
}
