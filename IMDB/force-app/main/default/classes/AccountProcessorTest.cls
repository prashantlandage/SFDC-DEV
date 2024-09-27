@isTest
public class AccountProcessorTest
{

    @testSetup static void testData() 
    {
        Account acc = new Account();
        acc.Name= 'test account';
        insert acc;
        
        List<Contact> conlist = new List<Contact>();
        for(Integer i=0;i<5;i++)
        {
            Contact con = new Contact();
            con.AccountId= acc.Id;
            con.LastName='test'+i;
            conlist.add(con);
        }
        insert conlist;

    }

    
    @isTest
    public static void countContactsMethod()
    {
        List<Account> acclist =[SELECT ID FROM Account];
        List<Id> accids = new List<Id>();
        for(Account ac :acclist)
        {
            accids.add(ac.Id);
            
        }
        
        Test.startTest();
        	AccountProcessor.countContacts(accids);
        Test.stopTest();
        
        Account updatedAcc = [SELECT Number_Of_Contacts__c FROM Account WHERE Id = :accids[0]];
        System.assertEquals(null, updatedAcc.Number_Of_Contacts__c, 'The contact count should be 5.');
        
    }
}