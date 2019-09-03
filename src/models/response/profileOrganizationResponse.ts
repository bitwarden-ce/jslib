import { BaseResponse } from './baseResponse';

import { OrganizationUserStatusType } from '../../enums/organizationUserStatusType';
import { OrganizationUserType } from '../../enums/organizationUserType';

export class ProfileOrganizationResponse extends BaseResponse {
    id: string;
    name: string;
    key: string;
    status: OrganizationUserStatusType;
    type: OrganizationUserType;

    constructor(response: any) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.key = this.getResponseProperty('Key');
        this.status = this.getResponseProperty('Status');
        this.type = this.getResponseProperty('Type');
    }
}
