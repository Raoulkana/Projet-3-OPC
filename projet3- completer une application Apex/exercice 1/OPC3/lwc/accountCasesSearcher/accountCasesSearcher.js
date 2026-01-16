import { LightningElement, api } from 'lwc';
import findCasesBySubject from '@salesforce/apex/AccountCasesController.findCasesBySubject';

const COLUMNS = [
    { label: 'Sujet', fieldName: 'Subject', type: 'text' },
    { label: 'Statut', fieldName: 'Status', type: 'text' },
    { label: 'Priorité', fieldName: 'Priority', type: 'text' },
];

export default class AccountCaseSearchComponent extends LightningElement {
    @api recordId;

    cases = [];
    error;
    searchTerm = '';
    isLoading = false;

    columns = COLUMNS;

    // ✅ Getter pour afficher la datatable uniquement s’il y a des résultats
    get hasCases() {
        return this.cases && this.cases.length > 0;
    }

    updateSearchTerm(event) {
        this.searchTerm = event.target.value;
    }

    handleSearch() {
        if (!this.recordId) {
            this.error = 'Aucun compte sélectionné.';
            return;
        }

        this.isLoading = true;
        this.error = undefined;

        findCasesBySubject({
            accountId: this.recordId,
            subjectSearchTerm: this.searchTerm
        })
            .then(result => {
                this.cases = result;
            })
            .catch(error => {
                this.error = error.body?.message || error.message;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }
}