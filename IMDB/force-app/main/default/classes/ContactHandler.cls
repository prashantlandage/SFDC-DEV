public class ContactHandler
{

    public static void contactMethod(List<Contact> conlist)
    {
        set<Id> accids = new set<Id>();
        if(!conlist.isEmpty())
        {
            for(Contact con : conlist)
            {
                if(con.AccountId != null)
                {
                    accids.add(con.AccountId);
                }
            }
            if(!accids.isEmpty())
            {
                Map<Id,Account> newacc = new Map<Id,Account>([SELECT ID,Max_Contact__c,(SELECT ID FROM Contacts) FROM Account WHERE ID In:accids]);
                
                For(Contact cn : conlist)
                {
                    Account ac = newacc.get(cn.AccountId);
                    if(ac.Contacts.size() >= ac.Max_Contact__c)
                    {
                        cn.addError('Yuuuuuuuuuuuuuuu');
                    }
                }
 
                
            }
        }
        
    }
    
    public static void conMethod(List<Contact> conlist,Map<Id,Contact> conMap)
    {
      
    }
    
    public static void contshareMethod(List<Contact> conlist)
    {
        Id conInnovatorId = [SELECT Id,Name FROM Group WHERE Name='Contact Innovators' LIMIT 1].Id;
        List<ContactShare> conshareupdate = new List<ContactShare>();
        if(!conlist.isEmpty())
        {
            for(Contact con : conlist)
            {
                ContactShare cons = new ContactShare();
                cons.ContactId=con.Id;
                cons.RowCause='Manual';
                cons.UserOrGroupId=conInnovatorId;
                cons.ContactAccessLevel='Edit';
                conshareupdate.add(cons);
            }
            if(!conshareupdate.isEmpty())
            {
                insert conshareupdate;
            }
        }
        
    }
}