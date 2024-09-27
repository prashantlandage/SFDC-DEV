public class AccountProcessor 
{
    @future
    public static void countContacts(List<Id> accountids)
    {
        List<Contact> contacts = [Select Id,AccountId,Account.Number_Of_Contacts__c from Contact Where AccountId IN :accountids];
    }

}