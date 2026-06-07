import type { Database } from "./database";

export type Profile =
    Database["public"]["Tables"]["profiles_drugcupsabot"]["Row"];
export type Pcu = Database["public"]["Tables"]["pcus_drugcupsabot"]["Row"];
export type Item = Database["public"]["Tables"]["items_drugcupsabot"]["Row"];
export type RequisitionPeriod =
    Database["public"]["Tables"]["requisition_periods_drugcupsabot"]["Row"];
export type Requisition =
    Database["public"]["Tables"]["requisitions_drugcupsabot"]["Row"];
export type RequisitionItem =
    Database["public"]["Tables"]["requisition_items_drugcupsabot"]["Row"];
export type PcuPersonnel =
    Database["public"]["Tables"]["pcu_personnel_drugcupsabot"]["Row"];

// Joined shapes used in the UI. These describe the *common* post-join
// shape that callers can rely on; real Supabase query results should be
// cast to these with `as unknown as T` (see E7/E7a in AGENT.md §3).
export type RequisitionItemWithItem = RequisitionItem & {
    items_drugcupsabot: Item;
};
export type RequisitionWithJoins = Requisition & {
    pcus_drugcupsabot: Pcu;
    requisition_periods_drugcupsabot: RequisitionPeriod;
    requisition_items_drugcupsabot: RequisitionItemWithItem[];
};
export type ProfileWithPcu = Profile & {
    pcus_drugcupsabot: Pcu;
};

export type RequisitionItemApproval = {
    id: number;
    approved_quantity: number;
};

export type AccountingSummaryRow = {
    pcu_id: number;
    pcu_name: string;
    total_value: number;
};
