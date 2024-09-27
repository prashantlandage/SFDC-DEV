public class AccountHandler
{

    public static void accountMethod(List<Account> acclist)
    {
        List<Contact> conlist = new List<Contact>();
        if(!acclist.isEmpty())
        {
            for(Account acc :acclist)
            {
               if(acc.Create_N_Contact__c !=null)
               {
                   for(integer i=0 ; i<acc.Create_N_Contact__c ;i++)
                   {
                       Contact con = new Contact();
                       con.LastName='test'+i;
                       con.AccountId=acc.id;
                       conlist.add(con);
                   }
               }
                
            }
            if(!conlist.isEmpty())
            {
                insert conlist;
            }
            
        }
        
    }
    
    public static void restoreaccount(List<Account> newrecords)
    {
        set<Id> accids= new set<Id>();
        List<Account> acctoupdate = new List<Account>();
        if(!newrecords.isEmpty())
        {
            for(Account ac:newrecords)
            {
                accids.add(ac.Id);
            }
            if(!accids.isEmpty())
            {
                List<Account> acclist=[SELECT ID,Name FROM Account WHERE ID IN : accids];
                if(!acclist.isEmpty())
                {
                    for(Account accc :acclist)
                    {
                        accc.Name='Restored '+accc.Name;
                        acctoupdate.add(accc);
                    }
                    if(!acctoupdate.isEmpty())
                    {
                        update acctoupdate;
                    }
                }
                
            }
        }
        
    }
    
    public static void accwebmethod(List<Account> newrecords, Map<Id,Account>accmap)
    {
        set<Id> accids = new set<Id>();
        if(!newrecords.isEmpty())
        {
            for(Account acc:newrecords)
            {
                if(acc.Website != accmap.get(acc.Id).Website)
                {
                    accids.add(acc.Id);
                }
            }
            if(!accids.isEmpty())
            {
                List<Contact> conlist=[select Id,AccountId,Account.Website FROM Contact
                                      WHERE AccountId In:accids];
                List<Contact> contoupdate = new List<Contact>();
                if(!conlist.isEmpty())
                {
                    for(Contact con : conlist)
                    {
                        con.Account_Website__c= con.Account.Website;
                        contoupdate.add(con);
                    }
                    if(!contoupdate.isEmpty())
                    {
                        update contoupdate;
                    }
                }
            }
        }
        
    }
    
    public static void industryupdate(List<Account> acclist,Map<Id,Account>accmap)
    {
        List<Id> accidlist= new List<Id>();
        if(!acclist.isEmpty())
        {
            for(Account acc:acclist)
            {
                if(acc.Industry != accmap.get(acc.Id).Industry && acc.Industry=='Biotechnology')
                {
                    accidlist.add(acc.Id);
                }
            }
            
            if(!accidlist.isEmpty())
            {
                callsAsync(accidlist);
                
            }
            
        }
        
    }
    
    public static void callsAsync(List<Id> accids)
    {
       if(!accids.isEmpty())
       {
           List<Contact> conlist = [SELECT Id, AccountId, LeadSource FROM Contact where AccountId  In :accids];
           List<Contact> contoupdate = new List<Contact>();
       }
    }
    
    public static void updateopp(List<Account> acclist)
    {
        set<Id> accids = new set<Id>();
        if(!acclist.isEmpty())
        {
            for(Account acc : acclist)
            {
                if(acc.Active__c=='No')
                {
                    accids.add(acc.Id);
                }
            }
            if(!accids.isEmpty())
            {
                List<Opportunity> opplist = [SELECT Id, AccountId, StageName FROM Opportunity 
                                             WHERE AccountId In :accids];
                List<Opportunity> opptoupdate = new List<Opportunity>();
                
                if(!opplist.isEmpty())
                {
                    for(Opportunity opp : opplist)
                    {
                        if(opp.StageName != 'close Won')
                        {
                            Opp.StageName='closed Lost';
                            opptoupdate.add(opp);
                        }
                    }
                    if(!opptoupdate.isEmpty())
                    {
                        update opptoupdate;
                    }
                }
            }
        }
    }
    
    public static void accountstatus(Map<Id,Account>newaccmap, Map<Id,Account> oldaccmap) 
    {
        set<Id> accids = new set<Id>();
        List<Contact> conlist= [SELECT AccountId,isActive__c FROM Contact WHERE AccountId In:newaccmap.keyset() and isActive__c=true];
        for(Contact con :conlist)
        {
            accids.add(con.AccountId);
        }
        for(Account acc : newaccmap.values())
        {
            Account oldacc= oldaccmap.get(acc.Id);
            if(oldacc.State__c=='Active')
            {
                if(acc.State__c=='Inactive'&& accids.contains(acc.Id))
                {
                    acc.addError('cannot inactive account with an active contact');
                }
            }
        }
    }


}