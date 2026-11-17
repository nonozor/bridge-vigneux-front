export class Mouvement {
    constructor(
        public type:"D"|"C" | null,
        public date:string ,
        public montant:number | null,
        public nbJetons:number |null ,
        public soldeJetons:number|null,
        
    ){}
}