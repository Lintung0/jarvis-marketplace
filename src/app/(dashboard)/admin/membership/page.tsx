import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Users, Package } from "lucide-react";
import { getAllPlansAdmin, getAllSubscriptionsAdmin } from "@/app/actions/membership";
import PlanManager from "./PlanManager";
import SubscriptionList from "./SubscriptionList";

export default async function AdminMembershipPage() {
  const [plans, subscriptions] = await Promise.all([
    getAllPlansAdmin(),
    getAllSubscriptionsAdmin(),
  ]);

  const activeSubs = subscriptions.filter(s => s.status === "active");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Membership Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Plans</CardTitle>
            <Crown className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanManager plans={plans} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionList subscriptions={subscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}
