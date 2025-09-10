
'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileDown, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dummyInventory = [
  { id: 'ITM001', name: 'Large Dustbins (120L)', inStock: 1500, distributed: 8500 },
  { id: 'ITM002', name: 'Small Dustbins (60L)', inStock: 3200, distributed: 12800 },
  { id: 'ITM003', name: 'Compost Kits', inStock: 800, distributed: 4200 },
  { id: 'ITM004', name: 'Safety Gloves (Pair)', inStock: 500, distributed: 2500 },
  { id: 'ITM005', name: 'High-Visibility Vests', inStock: 250, distributed: 1750 },
  { id: 'ITM006', name: 'Face Masks (Box of 50)', inStock: 1200, distributed: 6000 },
];

const REORDER_THRESHOLD = 500;

export default function InventoryPage() {
  const [inventory, setInventory] = useState(dummyInventory);
  const { toast } = useToast();

  const handleAddItem = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'The ability to add new inventory items will be implemented shortly.',
    });
  };

  const needsReorder = (stock: number) => stock < REORDER_THRESHOLD;

  return (
    <>
      <PageHeader
        title="Inventory Management"
        description="Track stock levels of essential equipment and supplies."
      >
         <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={handleAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
          <CardDescription>An overview of all items in the inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-center">In Stock</TableHead>
                <TableHead className="text-center">Distributed</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.inStock.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{item.distributed.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    {needsReorder(item.inStock) ? (
                      <Badge variant="destructive" className="flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Reorder
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-600 flex items-center justify-center">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
