import { Inventory } from '@/domains/entities/inventory';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { getUserInventoriesFetcher } from '../../../domains/apis/getUserInventories';
import { InventoryCard } from './InventoryCard';

export function InventoryGrid() {
  const { data: result } = useQuery({
    queryKey: ['user-inventories'],
    queryFn: getUserInventoriesFetcher,
  });

  const inventories = useMemo(() => result?.data ?? [], [result]);
  const [selected, setSelected] = useState<(typeof inventories)[0] | null>(null);

  return inventories.length > 0 ? (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {inventories.map((item) => (
          <motion.div key={item.id} layoutId={item.id}>
            <InventoryCard
              name={item.ingredient.name}
              quantity={item.quantity}
              unit={item.unit}
              category={item.ingredient.category}
              onClick={() => setSelected(item)}
            />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selected && <FloatingInventoryCard item={selected} setSelected={setSelected} />}
      </AnimatePresence>
    </>
  ) : (
    <EmptyInventory />
  );
}

type FloatingInventoryCardProps = {
  item: Inventory;
  setSelected: (item: Inventory | null) => void;
};

function FloatingInventoryCard({ item, setSelected }: FloatingInventoryCardProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelected(null)}
      />

      {/* Floating Card */}
      <motion.div
        layoutId={item.id}
        className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2"
      >
        <InventoryCard
          name={item.ingredient.name}
          quantity={item.quantity}
          unit={item.unit}
          category={item.ingredient.category}
          onClick={() => setSelected(null)} // optional close on card click
        />
      </motion.div>
    </>
  );
}

function EmptyInventory() {
  return (
    <div className="flex h-full items-center justify-center py-10">
      <p className="text-2xl text-gray-500">No inventory found</p>
    </div>
  );
}
