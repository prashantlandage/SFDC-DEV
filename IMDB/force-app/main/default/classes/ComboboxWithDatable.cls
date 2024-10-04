public class ComboboxWithDatable
{
    @AuraEnabled(cacheable=true)
    public static List<Account> getaccount()
    {
        List<Account> acclist =[SELECT Id, Name FROM Account];
        return acclist;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getcontacts(String selectedAccountId)
    {
        List<Contact> conlist =[SELECT Id,Name,Email,AccountId 
                               FROM Contact WHERE AccountId =:selectedAccountId];
        return conlist;
    }

}