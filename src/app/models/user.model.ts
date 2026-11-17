export class User {
    constructor(
        public noFFB:String,
        public nom:string | null,
        public prenom:string | null,
        public soldeJetons:number | null,
        public adherent:number | null,
        public admin:number | null,
        public checked:boolean | null,
        public dateCreation:string |null
    ){}
}