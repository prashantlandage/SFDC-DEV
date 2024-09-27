@isTest
public class LeadProcessorTest {

    @isTest
    static void testLeadProcessor() {
        
        List<Lead> leads = new List<Lead>();
        for (Integer i = 0; i < 200; i++) {
            leads.add(new Lead(FirstName = 'Test', LastName = 'Lead' + i, Company = 'Test Company'));
        }
        insert leads;

       
        System.assertEquals(200, [SELECT COUNT() FROM Lead]);

        
        Test.startTest();
        LeadProcessor batch = new LeadProcessor();
        Database.executeBatch(batch, 200);
        Test.stopTest();

        
    }
     @isTest
    static void testEmptyBatch() {
        
        Test.startTest();
        LeadProcessor batch = new LeadProcessor();
        Database.executeBatch(batch, 200);
        Test.stopTest();

       
        System.assertEquals(0, [SELECT COUNT() FROM Lead WHERE LeadSource = 'Dreamforce']);
    }
}