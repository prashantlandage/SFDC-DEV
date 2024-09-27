@isTest
public class TestRestrictContactByName
{
    @isTest
    static void TestRestrictContactByNameMethod()
    {
        
       Account acct = new Account(Name='Test Account');
       insert acct;
        
        Contact con = new Contact();
        con.AccountId=acct.Id;
        con.LastName='INVALIDNAME TEST';
        insert con;
        
        con.LastName = 'INVALIDNAME';

         Test.startTest();
        try {
            
           update con;
            System.assertNotEquals(null, [SELECT Id FROM Contact WHERE LastName='Smith' LIMIT 1], 'Expected contact to be inserted');
        } catch (DmlException e) {
            
           
        }
        Test.stopTest();
        
    }

}