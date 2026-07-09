"use client"

import { useState } from "react"
import { Package, Plus, Search, Trash2, Edit } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { deleteProduct } from "@/app/actions/products"

export interface ProductData {
  id: string
  title: string
  slug: string
  price: number
  stock: number
  status: "active" | "pending" | "hidden" | "draft" | "rejected"
  category: { name: string; slug: string } | null
  created_at: string
  views: number
  sold_count: number
  images?: Array<{ url: string; is_primary: boolean }>
}

export interface VendorProductTableProps {
  products: ProductData[]
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
  active: "success",
  pending: "warning",
  hidden: "secondary",
  draft: "info",
  rejected: "destructive",
}

export function ProductTable({ products }: VendorProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function handleDelete(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    setDeleting(productId)
    try {
      await deleteProduct(productId)
    } catch {
      alert("Failed to delete product")
    }
    setDeleting(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            <img src={product.images[0].url} alt={product.title} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-foreground">{product.title}</div>
                          <div className="text-sm text-muted-foreground">{product.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatCurrency(product.price)}</div>
                      {product.stock > 0 && (
                        <div className="text-xs text-green-600">In Stock</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? "text-destructive font-medium" : "font-medium"}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[product.status] ?? "secondary"}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.sold_count}</div>
                      <div className="text-xs text-muted-foreground">{product.views} views</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/vendor/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {deleting === product.id ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-12 w-12 mb-3 text-muted-foreground/40" />
                      <p className="text-lg font-medium text-foreground">No products found</p>
                      <p className="text-sm text-muted-foreground mt-2">Start by adding your first product</p>
                      <Button asChild className="mt-4">
                        <Link href="/vendor/products/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
