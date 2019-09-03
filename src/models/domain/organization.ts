import { OrganizationData } from '../data/organizationData';

import { OrganizationUserStatusType } from '../../enums/organizationUserStatusType';
import { OrganizationUserType } from '../../enums/organizationUserType';

export class Organization {
    id: string;
    name: string;
    status: OrganizationUserStatusType;
    type: OrganizationUserType;

    constructor(obj?: OrganizationData) {
        if (obj == null) {
            return;
        }

        this.id = obj.id;
        this.name = obj.name;
        this.status = obj.status;
        this.type = obj.type;
    }

    get canAccess() {
        if (this.type === OrganizationUserType.Owner) {
            return true;
        }
        return this.status === OrganizationUserStatusType.Confirmed;
    }

    get isManager() {
        return this.type === OrganizationUserType.Manager || this.type === OrganizationUserType.Owner ||
            this.type === OrganizationUserType.Admin;
    }

    get isAdmin() {
        return this.type === OrganizationUserType.Owner || this.type === OrganizationUserType.Admin;
    }

    get isOwner() {
        return this.type === OrganizationUserType.Owner;
    }
}
