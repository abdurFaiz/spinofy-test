interface ItemDetailsProps {
  name: string;
  notes?: string | null;
  size?: string;
  ice?: string;
  options?: string[];
}

export function ItemDetails({
  name,
  notes,
  size,
  ice,
  options,
}: ItemDetailsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-rubik font-medium capitalize">{name}</h3>
      <div className="flex flex-col gap-1">
        {size && (
          <p className="text-xs font-rubik text-body capitalize">
            Ukuran: {size}
          </p>
        )}
        {ice && (
          <p className="text-xs font-rubik text-body capitalize">Es: {ice}</p>
        )}
        {options && options.length > 0 && (
          <p className="text-xs font-rubik text-body capitalize">
            Pilihan: {options.join(", ")}
          </p>
        )}
        {notes && (
          <p className="text-xs font-rubik text-body capitalize">
            Notes: {notes}
          </p>
        )}
      </div>
    </div>
  );
}
