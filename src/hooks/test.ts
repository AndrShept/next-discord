import { create } from 'zustand';

interface randArray {
  age: string;
  name: string;
  quantity: number;
}

interface IHook {
  data: randArray[];
  item: number;
  dual: randArray;

  removeItems: (id: string) => void;
  increment: () => void;
  decrement: () => void;
  quantityAdd: () => void;
  findDual: () => void;
  addData: (obj:randArray)=> void
}

export const useTest = create<IHook>((set) => ({
  data: [],
  dual: {age: '', name: '', quantity : 0},
  item: 0,
  addData: (obj: randArray) => set((state)=> ({data: [...state.data, obj]})),
  removeItems: (id: string) =>
    set((state) => ({ data: state.data.filter((items) => items.age !== id) })),
  findDual: () =>
    set((state) => ({
        dual: state.data.find((item) => item.quantity % 2 === 0),
    })),
  increment: () => set((state) => ({ item: state.item + 1 })),
  decrement: () => set(() => ({ item: 10 })),
  quantityAdd: () =>
    set((state) => ({
      data: state.data.map((item) => ({
        ...item,
        quantity: item.quantity + 1,
      })),
    })),
}));

