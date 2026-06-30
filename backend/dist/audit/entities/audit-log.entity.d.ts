export declare class AuditLog {
    id: string;
    entityName: string;
    entityId: string;
    action: string;
    changes: {
        before?: any;
        after?: any;
        fields?: string[];
    };
    userId: string;
    userEmail: string;
    userIp: string;
    createdAt: Date;
}
