export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type ProfileRole = "admin" | "pcu";
export type ProfileStatus = "pending" | "approved" | "rejected";
export type RequisitionStatus =
    | "draft"
    | "submitted"
    | "approved"
    | "fulfilled";
export type RequisitionPeriodStatus = "open" | "closed";

export type Database = {
    public: {
        Tables: {
            profiles_drugcupsabot: {
                Row: {
                    id: string;
                    username: string;
                    email: string;
                    role: ProfileRole;
                    pcu_id: number;
                    status: ProfileStatus;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    email: string;
                    role?: ProfileRole;
                    pcu_id: number;
                    status?: ProfileStatus;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    username?: string;
                    email?: string;
                    role?: ProfileRole;
                    pcu_id?: number;
                    status?: ProfileStatus;
                    created_at?: string;
                };
                Relationships: [];
            };
            pcus_drugcupsabot: {
                Row: {
                    id: number;
                    name: string;
                };
                Insert: {
                    id?: number;
                    name: string;
                };
                Update: {
                    id?: number;
                    name?: string;
                };
                Relationships: [];
            };
            items_drugcupsabot: {
                Row: {
                    id: number;
                    name: string;
                    unit_pack: string;
                    price_per_unit: number;
                    category: string;
                    category_order: number | null;
                    item_order: number | null;
                    is_active: boolean;
                    is_available: boolean;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    name: string;
                    unit_pack: string;
                    price_per_unit: number;
                    category: string;
                    category_order?: number | null;
                    item_order?: number | null;
                    is_active?: boolean;
                    is_available?: boolean;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    name?: string;
                    unit_pack?: string;
                    price_per_unit?: number;
                    category?: string;
                    category_order?: number | null;
                    item_order?: number | null;
                    is_active?: boolean;
                    is_available?: boolean;
                    notes?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            requisition_periods_drugcupsabot: {
                Row: {
                    id: number;
                    name: string;
                    start_date: string;
                    end_date: string;
                    status: RequisitionPeriodStatus;
                };
                Insert: {
                    id?: number;
                    name: string;
                    start_date: string;
                    end_date: string;
                    status?: RequisitionPeriodStatus;
                };
                Update: {
                    id?: number;
                    name?: string;
                    start_date?: string;
                    end_date?: string;
                    status?: RequisitionPeriodStatus;
                };
                Relationships: [];
            };
            requisitions_drugcupsabot: {
                Row: {
                    id: number;
                    pcu_id: number;
                    period_id: number;
                    requester_id: string;
                    status: RequisitionStatus;
                    submitted_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    pcu_id: number;
                    period_id: number;
                    requester_id: string;
                    status?: RequisitionStatus;
                    submitted_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    pcu_id?: number;
                    period_id?: number;
                    requester_id?: string;
                    status?: RequisitionStatus;
                    submitted_at?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            requisition_items_drugcupsabot: {
                Row: {
                    id: number;
                    requisition_id: number;
                    item_id: number;
                    quantity: number;
                    on_hand_quantity: number | null;
                    approved_quantity: number | null;
                    price_at_request: number;
                };
                Insert: {
                    id?: number;
                    requisition_id: number;
                    item_id: number;
                    quantity: number;
                    on_hand_quantity?: number | null;
                    approved_quantity?: number | null;
                    price_at_request: number;
                };
                Update: {
                    id?: number;
                    requisition_id?: number;
                    item_id?: number;
                    quantity?: number;
                    on_hand_quantity?: number | null;
                    approved_quantity?: number | null;
                    price_at_request?: number;
                };
                Relationships: [];
            };
            pcu_personnel_drugcupsabot: {
                Row: {
                    id: number;
                    pcu_id: number;
                    requester_name: string | null;
                    requester_position: string | null;
                    receiver_name: string | null;
                    receiver_position: string | null;
                };
                Insert: {
                    id?: number;
                    pcu_id: number;
                    requester_name?: string | null;
                    requester_position?: string | null;
                    receiver_name?: string | null;
                    receiver_position?: string | null;
                };
                Update: {
                    id?: number;
                    pcu_id?: number;
                    requester_name?: string | null;
                    requester_position?: string | null;
                    receiver_name?: string | null;
                    receiver_position?: string | null;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: {
            update_approved_quantities: {
                Args: {
                    items_data: Array<{
                        id: number;
                        approved_quantity: number;
                    }>;
                };
                Returns: void;
            };
            get_accounting_summary_by_period: {
                Args: {
                    period_id_param: number;
                };
                Returns: Array<{
                    pcu_id: number;
                    pcu_name: string;
                    total_value: number;
                }>;
            };
        };
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};
