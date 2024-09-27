public with sharing class questionsData {
    @AuraEnabled(cacheable=true)
    public static List<QuizQuestion__c> getquestions() {
        return [SELECT Id,Name,question__c, option_A__c, option_B__c, option_C__c, option_D__c, answer__c FROM QuizQuestion__c];
    }
    
}