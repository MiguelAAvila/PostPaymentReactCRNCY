export function formatPaymentPayload (headerId, paymentAmnt, InstNum, PaymentDate, userId, companyId) {
    try {
        if(!headerId || !paymentAmnt || !InstNum || !PaymentDate){
            throw Error("All fields are require to send post  request to PostPayment")
        }
        return {
            "CompanyId": companyId ?? 318,
            "StoreId": 7,
            "UserId": userId ?? 4283,
            "HeaderId": headerId,
            "PaymentDate": PaymentDate,
            "PaymentAmount": paymentAmnt,
            "ChangeDue": 0,
            "SelectedCoupon": 0,
            "CouponAmount": 0,
            "PaymentMethod": 2,
            "PartnerUserId": 0,
            "PartnerLocationId": 0,
            "IsRescind": false,
            "RescindAba": "",
            "RescindAcctNumber": "",
            "RescindPmtType": 0,
            "RescindCheckNumber": "",
            "InstrumentNumber": InstNum,
            "CciCheckNumber": "",
            "CciCheckAmt": "",
            "CardId": 0,
            "CardCCV": 0,
            "ManualCardLast4Digits": "",
            "ManualCardCardType": "",
            "ManualCardNameOnCard": "",
            "ManualCardExpireDate": "",
            "ManualCardAuthCode": "",
            "ConvenienceFee": 0,
            "BankId": 0,
            "Notes": "",
            "IsRefi": false,
            "RefiLoanModelId": 0,
            "RefiTermFrequencyId": 0,
            "ChannelId": 0,
            "InheritOptionalFeesOnRefi": true,
            "IntentionId": 0,
            "DisbursementType": 1,
            "IsOnlineEsign": true,
            "AlternateDisbursement": {
                "Card": {
                    "CardID": 0,
                    "CardRef": ""
                }
            },
            "RefiOptionalSelectedFeeIds": [
                0
            ],
            "Errors": [
    
            ],
            "CancelRepo": true
        }
    } catch (error) {
        console.error(`Error formatting PostPayment Payload: ${error}`);
    }
   
}