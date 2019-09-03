import { BaseResponse } from './baseResponse';

import { PlanType } from '../../enums/planType';

export class OrganizationResponse extends BaseResponse {
    id: string;
    name: string;
    businessName: string;
    businessAddress1: string;
    businessAddress2: string;
    businessAddress3: string;
    businessCountry: string;
    businessTaxNumber: string;

    constructor(response: any) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.businessName = this.getResponseProperty('BusinessName');
        this.businessAddress1 = this.getResponseProperty('BusinessAddress1');
        this.businessAddress2 = this.getResponseProperty('BusinessAddress2');
        this.businessAddress3 = this.getResponseProperty('BusinessAddress3');
        this.businessCountry = this.getResponseProperty('BusinessCountry');
        this.businessTaxNumber = this.getResponseProperty('BusinessTaxNumber');
    }
}
