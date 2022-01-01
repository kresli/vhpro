import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { usePopper } from "react-popper";
import { Button } from ".";

interface Item<T> {
  id: string;
  label: string;
  value: T;
}
interface Props<T> {
  items: Item<T>[];
  selected: string;
  onChange: (item: Item<T>) => void;
}

function hasPopperParent(
  popper: HTMLDivElement | null,
  element: HTMLElement
): boolean {
  console.log(popper, element);
  if (!popper) return false;
  let parent: HTMLElement | null = element;
  while (parent) {
    if (parent === popper) return true;
    parent = parent.parentElement;
  }
  return false;
}

export const InputSelect = <T extends any>({
  selected,
  items,
  onChange,
}: Props<T>) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const popperElementRef = useRef(popperElement);
  popperElementRef.current = popperElement;
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const selectedItem = useMemo(
    () => items.find(({ id }) => id === selected) || items[0],
    [items, selected]
  );
  const [visible, setVisible] = useState(false);
  const handleClick = useCallback(() => {
    const onMouseDown = ({ target }: MouseEvent) => {
      const isParent = hasPopperParent(
        popperElementRef.current,
        target as unknown as HTMLElement
      );
      console.log(isParent);
      if (isParent) return;
      setVisible(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    setVisible(true);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);
  const handleChange = useCallback(
    (item: Item<T>) => {
      setVisible(false);
      onChange(item);
    },
    [onChange]
  );
  return (
    <div className="relative">
      <div ref={setReferenceElement} className="h-full">
        <Button onClick={handleClick}>
          <div className="flex-nowrap flex">
            <span className="whitespace-nowrap">{selectedItem.label}</span>{" "}
            <ChevronDownIcon className="ml-1 w-4" />
          </div>
        </Button>
      </div>
      {visible && (
        <div
          ref={setPopperElement}
          style={{
            ...styles.popper,
          }}
          {...attributes.popper}
        >
          <div className="whitespace-nowrap flex flex-col border rounded-md bg-white shadow-md m-2">
            {items.map((item) => {
              const { id, label } = item;
              return (
                <button
                  key={id}
                  className="p-4 hover:bg-gray-100"
                  onClick={() => handleChange(item)}
                >
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
