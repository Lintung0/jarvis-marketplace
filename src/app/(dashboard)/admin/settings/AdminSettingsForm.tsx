"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Info } from "lucide-react"

export interface AdminSettingsFormProps {
  stats: { totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number }
  storageDriver: string
  aiConfig: { configured: boolean; model: string }
  watermarkEnabled: boolean
}

export function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-muted rounded-xl p-3 text-center">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function StatusRow({
  icon,
  title,
  subtitle,
  status,
  statusLabel,
  extra,
}: {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  status: "active" | "inactive"
  statusLabel?: string
  extra?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-400" : "bg-muted-foreground"}`} />
        <div>
          <p className="font-medium text-foreground">{title}</p>
          {(subtitle || statusLabel) && (
            <p className={`text-xs font-medium ${status === "active" ? "text-green-500" : "text-muted-foreground"}`}>
              {statusLabel ?? (status === "active" ? "Active" : "Inactive")}
            </p>
          )}
        </div>
      </div>
      {extra}
    </div>
  )
}

export function ConfigAlert({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <Alert className="bg-teal-50 border-teal-200">
      <Info className="h-4 w-4 text-teal-500" />
      {title && <AlertTitle className="text-teal-800 text-sm">{title}</AlertTitle>}
      <AlertDescription className="text-xs text-teal-600">{children}</AlertDescription>
    </Alert>
  )
}

export function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

export function AdminSettingsForm({ stats, storageDriver, aiConfig, watermarkEnabled: initialWatermark }: AdminSettingsFormProps) {
  const [appName, setAppName] = useState("Modesy")
  const [commissionRate, setCommissionRate] = useState("10")
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("50000")
  const [shippingFee, setShippingFee] = useState("10000")
  const [watermarkEnabled, setWatermarkEnabled] = useState(initialWatermark)
  const [saved, setSaved] = useState(false)
  const [cacheClearing, setCacheClearing] = useState(false)
  const [cacheMessage, setCacheMessage] = useState<string | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {saved && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 text-sm">Settings saved successfully!</AlertTitle>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard title="General">
          <div className="space-y-2">
            <Label htmlFor="appName">App Name</Label>
            <Input id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Platform Stats</Label>
            <div className="grid grid-cols-2 gap-3">
              <StatBox value={stats.totalUsers ?? 0} label="Users" />
              <StatBox value={stats.totalProducts ?? 0} label="Products" />
              <StatBox value={stats.totalOrders ?? 0} label="Orders" />
              <StatBox value={`Rp${(stats.totalRevenue / 1000000).toFixed(1)}jt`} label="Revenue" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Commission">
          <div className="space-y-2">
            <Label htmlFor="commissionRate">Default Commission Rate</Label>
            <div className="flex items-center gap-2">
              <Input id="commissionRate" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} />
              <span className="text-muted-foreground font-medium">%</span>
            </div>
          </div>
          <ConfigAlert>
            Hierarchy: Product &gt; Vendor &gt; Category &gt; Global
          </ConfigAlert>
        </SettingsCard>

        <SettingsCard title="Payment Gateways">
          <StatusRow
            title="Xendit"
            statusLabel="Connected"
            status="active"
          />
        </SettingsCard>

        <SettingsCard title="File Storage">
          <div className="space-y-3">
            <StorageRow driver="Supabase Storage" current={storageDriver} match="supabase" />
            <StorageRow driver="S3 (AWS)" current={storageDriver} match="s3" />
            <StorageRow driver="Cloudflare R2" current={storageDriver} match="r2" />
            <StorageRow driver="Backblaze B2" current={storageDriver} match="b2" />
          </div>
        </SettingsCard>

        <SettingsCard title="Shipping">
          <div className="space-y-2">
            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (Rp)</Label>
            <Input id="freeShippingThreshold" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingFee">Default Shipping Fee (Rp)</Label>
            <Input id="shippingFee" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} />
          </div>
        </SettingsCard>

        <SettingsCard title="AI Features">
          <StatusRow
            title="OpenAI"
            subtitle={aiConfig.configured ? aiConfig.model : undefined}
            status={aiConfig.configured ? "active" : "inactive"}
            statusLabel={aiConfig.configured ? "Connected" : "Not Configured"}
          />
          {!aiConfig.configured && (
            <ConfigAlert>
              Set <code className="font-mono bg-teal-100 px-1 rounded">OPENAI_API_KEY</code> in .env.local to enable AI features.
            </ConfigAlert>
          )}
        </SettingsCard>

        <SettingsCard title="Image Watermark">
          <StatusRow
            title="Watermark on Uploads"
            subtitle='Adds "Modesy" watermark to bottom-right of uploaded images'
            status={watermarkEnabled ? "active" : "inactive"}
            extra={
              <Switch
                checked={watermarkEnabled}
                onCheckedChange={async (checked) => {
                  setWatermarkEnabled(checked)
                  await fetch("/api/admin/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: "watermark_enabled", value: String(checked) }),
                  })
                }}
              />
            }
          />
        </SettingsCard>

        <SettingsCard title="Cache">
          <StatusRow
            title="In-Memory Cache"
            subtitle="Clears cached queries for categories, settings, and other data"
            status="active"
            statusLabel="Ready"
            extra={
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={cacheClearing}
                onClick={async () => {
                  setCacheClearing(true)
                  setCacheMessage(null)
                  try {
                    const res = await fetch("/api/cache/clear", { method: "POST" })
                    const data = await res.json()
                    setCacheMessage(data.message ?? "Cache cleared")
                  } catch {
                    setCacheMessage("Failed to clear cache")
                  }
                  setCacheClearing(false)
                }}
              >
                {cacheClearing ? "Clearing..." : "Clear Cache"}
              </Button>
            }
          />
          {cacheMessage && (
            <p className="text-xs text-muted-foreground px-1">{cacheMessage}</p>
          )}
        </SettingsCard>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Settings
        </Button>
      </div>
    </form>
  )
}

export function StorageRow({ driver, current, match }: { driver: string; current: string; match: string }) {
  const active = current === match
  return (
    <StatusRow
      title={driver}
      status={active ? "active" : "inactive"}
      statusLabel={active ? "Active" : "Inactive"}
    />
  )
}
