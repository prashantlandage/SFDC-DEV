public class LeadHandler
{
    public static void LeadMethod(List<Lead> ldlist,Map<Id,Lead> leadmap)
    {
        if(!ldlist.isEmpty())
        {
            for(Lead ld :ldlist)
            {
                if(ld.Status != leadmap.get(ld.Id).Status)
                {
                    ld.Status ='Working - Contacted';
                }
            }
            
        }
    }
    
    public static void deleteMethod(List<Lead> ldlist)
    {
        if(!ldlist.isEmpty())
        {
            for(Lead ld :ldlist)
            {
                if(ld.Status == 'Working - Contacted')
                {
                    ld.addError('You can not delete lead');
                }
            }
        }
    }
    
    
    

}