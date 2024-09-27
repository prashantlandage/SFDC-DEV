public class OpportunityHandler {
    public static void OpportunityMethod(List<Opportunity> opplist) {
        Set<Id> oppIds = new Set<Id>();

        
        for (Opportunity opp : opplist) {
            if (opp.StageName == 'Closed Lost') {
                oppIds.add(opp.Id);
            }
        }

        
        if (!oppIds.isEmpty()) {
            List<OpportunityTeamMember> oppTeamList = [SELECT Id, OpportunityId 
                                                       FROM OpportunityTeamMember
                                                       WHERE OpportunityId IN :oppIds];
            if (!oppTeamList.isEmpty()) {
                delete oppTeamList;
            }
        }
    }
    
    public static void OpportunistsRole(List<Opportunity> opplist)
    {
        
    }
}