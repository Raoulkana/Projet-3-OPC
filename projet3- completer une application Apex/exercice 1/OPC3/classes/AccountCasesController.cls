public with sharing class AccountCasesController {

    @AuraEnabled(cacheable=true)
    public static List<Case> findCasesBySubject(Id accountId, String subjectSearchTerm) {

        // Sécurité : compte obligatoire
        if (accountId == null) {
            throw new AuraHandledException('AccountId manquant.');
        }

        // Préparation du terme de recherche
        String searchTerm = '%' + (subjectSearchTerm == null ? '' : subjectSearchTerm) + '%';

        return [
            SELECT Id, Subject, Status, Priority
            FROM Case
            WHERE AccountId = :accountId
            AND Subject LIKE :searchTerm
            ORDER BY CreatedDate DESC
            LIMIT 50
        ];
    }
}