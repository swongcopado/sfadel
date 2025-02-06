import { LightningElement, api } from 'lwc';
import noArticlesFound from '@salesforce/label/c.No_Articles';
import knowledgeArticleSubtitle from '@salesforce/label/c.Knowledge_Article_Card_Subtitle';

export default class KnowledgeArticleList extends LightningElement {
    label = {
        noArticlesFound,
        knowledgeArticleSubtitle,
    };

    /**
     * listOfArticles = [id, title, date, summary, link, image]
     */
    @api listOfArticles = [];
    articles = [];
    hasNoArticles;

    connectedCallback() {
        try {
            this.articles = this.listOfArticles.slice(0, 3);
            this.hasNoArticles = this.articles.length === 0;
        } catch (err) {
            console.error(err);
        }
    }
}