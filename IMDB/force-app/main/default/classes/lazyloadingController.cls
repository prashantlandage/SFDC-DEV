public with sharing class lazyloadingController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getaccounts(Integer LimitSize , Integer Offset) {
        List<Account> acclist =[SELECT Id, Name,Rating
                                FROM Account
                                Order By CreatedDate
                                LIMIT :LimitSize 
                                OFFSET :Offset
                               ];
        return acclist;

    }
}