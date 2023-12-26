import { ICargo } from '../models';

export const draft_flight = null
export let cargos = new Map<string, ICargo>([
    ["668e580c-ed60-454f-95cb-86b10a1b265d", {
      "uuid": "668e580c-ed60-454f-95cb-86b10a1b265d",
      "name": "Кислород",
      "en_name": "oxygen",
      "category": "Кислород",
      "price": 19500,
      "weight": 60,
      "capacity": 0.05,
      "description": "Кислород в баллонах под высоким давлением",
      "photo": "http://localhost:9000/images/oxygen.jpg"
    }
    ],
    ["2d6d7e83-de1f-473e-a11b-81119da7f26f", {
        "uuid": "2d6d7e83-de1f-473e-a11b-81119da7f26f",
        "name": "Чай черный",
        "en_name": "tea",
        "category": "Напитки",
        "price": 750,
        "weight": 0.003,
        "capacity": 0.0003,
        "description": "Чай черный цейлонский без сахара в специализированном пакете",
        "photo": "http://localhost:9000/images/tea.jpg"
    }
    ],
    ["c997bf5c-8da9-498a-bcf1-39787d56eec8", {
        "uuid": "c997bf5c-8da9-498a-bcf1-39787d56eec8",
        "name": "Хлеб пшеничный",
        "en_name": "bread",
        "category": "Еда",
        "price": 380,
        "weight": 0.03,
        "capacity": 0.00015,
        "description": "Мука пшеничная, вода, маргарин, сахар, дрожжи, соль, молоко сухое",
        "photo": "http://localhost:9000/images/bread.jpg"
    }
    ]
])