export interface EventData {
    id?: number;
    name: string;
    createDate?: Date;
    holdingDate?: Date;
    eventTimeZone: string;
    beginHoldingDate?: Date;
    type: number;
    userId: number;
    status?: number;
    description?: string;
    companyId: number;
    del?: number;
    originalFileName?: string;
    serverFileName?: string;
    fotoUrl?: string;
    userRole?: number;
}

export interface PagingData {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface GetCompanyEventsData {
    events?: EventData[];
    paging?: PagingData;
}

export interface EventInviteUsersData {
    eventId?: number;
    email: string[];
}