from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

QUESTS_PASSWORD = os.environ.get('QUESTS_PASSWORD', 'kraken2026')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'amiral2026')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ MODELS ============
class WorldLore(BaseModel):
    title: str
    intro: str
    sections: List[dict]  # {heading, body}


class ClassItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    name: str
    subtitle: str
    description: str
    image_url: str


class Quest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    title: str
    difficulty: str  # "Facile", "Moyen", "Difficile", "Épique"
    location: str
    description: str
    reward: str


class QuestPasswordRequest(BaseModel):
    password: str


class JournalEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str  # ISO date "YYYY-MM-DD"
    title: str
    body: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class JournalEntryCreate(BaseModel):
    date: str
    title: str
    body: str


class PassportTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    name: str
    description: str
    thumbnail_url: str
    download_url: str


# ============ SEED ============
DEFAULT_WORLD = {
    "title": "Le Monde des Héritiers",
    "intro": (
        "Il y a mille ans, l'Ordre des Anciens dissimula dix reliques aux quatre coins des mers oubliées. "
        "Non pour protéger un trésor, mais pour préparer ceux qui devraient un jour affronter le retour des Infectés. "
        "Aujourd'hui, la Confrérie des Héritiers est née, et vous en êtes."
    ),
    "sections": [
        {
            "heading": "Les Mers Fracturées",
            "body": "Un archipel de vestiges, de brumes hantées et de ports de contrebandiers. Chaque île garde un secret, chaque secret garde un prix."
        },
        {
            "heading": "La Menace des Infectés",
            "body": "Créatures nées de la corruption d'une ancienne relique brisée, elles reviennent avec la marée noire. Nul métal ne les blesse, seule la volonté des Héritiers."
        },
        {
            "heading": "La Confrérie",
            "body": "Dix classes, dix voies, une même cause : rassembler les reliques dispersées avant que la nuit d'obsidienne ne recouvre les mers."
        },
    ],
}

CHARTE_BRETTEUR = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/37kh7zqo_classe%20Bretteur.png"
CHARTE_BOSCO = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/jptf11yg_Classe%20Bosco.png"
CHARTE_NAVIGATEUR = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/v9gqo7ga_classe%20navigateur.png"
CHARTE_TIREUR = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/89jz7lj2_classe%20tireur%20d%27elite.png"
CHARTE_MAREES = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/7jn3ac2b_classe%20ma%C3%AEtre%20des%20mar%C3%A9es.png"
CHARTE_MEDECIN = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/ujna0qvr_classe%20M%C3%A9decin%20de%20bord.png"
CHARTE_ECLAIREUR = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/jgr1q4oo_classe%20%C3%A9claireur.png"
CHARTE_MESSAGER = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/sruknpbh_classe%20messager.png"
CHARTE_CHASSEUR = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/mwdufjwk_classe%20chasseur%20de%20tr%C3%A9sors.png"
CHARTE_ALCHIMISTE = "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/sqrnuds9_classe%20alchimiste.png"

DEFAULT_CLASSES = [
    {"order": 1, "name": "Bretteur", "subtitle": "Le courage ouvre le chemin.",
     "description": "Le Bretteur est le protecteur de son équipage. Il se place entre le danger et ses compagnons et affronte les menaces sans jamais reculer. Maître des combats rapprochés, il utilise sa force, sa rapidité et son courage pour ouvrir la voie et défendre ceux qui lui font confiance.",
     "image_url": CHARTE_BRETTEUR},
    {"order": 2, "name": "Bosco", "subtitle": "Le pilier de l'équipage.",
     "description": "Le Bosco est le pilier de l'équipage. Il entretient le matériel, répare ce qui est brisé et trouve toujours une solution pratique lorsque tout semble perdu. Ingénieux, débrouillard et organisé.",
     "image_url": CHARTE_BOSCO},
    {"order": 3, "name": "Navigateur", "subtitle": "Connaître le chemin, c'est guider l'équipage.",
     "description": "Le Navigateur est le guide de l'équipage. Il lit les cartes anciennes, comprend les étoiles et connaît les secrets des mers et des terres. Sans lui, le groupe pourrait se perdre ou passer à côté de trésors et de lieux importants.",
     "image_url": CHARTE_NAVIGATEUR},
    {"order": 4, "name": "Tireur d'Élite", "subtitle": "Une seule flèche, un seul souffle, le destin est atteint.",
     "description": "Le Tireur d'Élite est la précision incarnée. Patient, calme et concentré, il excelle à longue distance et sait frapper là où cela compte le plus. Son œil perçant repère les moindres faiblesses.",
     "image_url": CHARTE_TIREUR},
    {"order": 5, "name": "Maître des Marées", "subtitle": "Les marées obéissent à ceux qui savent les écouter.",
     "description": "Le Maître des Marées connaît les secrets de l'eau, du vent et des rivages. Il observe la nature avec patience et guide son équipage à travers les milieux naturels, prévoit les changements de météo.",
     "image_url": CHARTE_MAREES},
    {"order": 6, "name": "Médecin de Bord", "subtitle": "Chaque soin compte, chaque vie est précieuse.",
     "description": "Le Médecin de Bord veille sur la santé de son équipage. Grâce à son savoir-faire, il soigne les blessures, pose des bandages et garde son calme même dans les situations les plus dangereuses.",
     "image_url": CHARTE_MEDECIN},
    {"order": 7, "name": "Éclaireur", "subtitle": "Voir avant les autres, protéger l'équipage.",
     "description": "L'Éclaireur est les yeux et les oreilles de l'équipage. Il observe, analyse et anticipe les dangers avant qu'ils ne se présentent. Discret et attentif, il repère les indices laissés par le vent, la nature ou ceux qui sont passés avant eux.",
     "image_url": CHARTE_ECLAIREUR},
    {"order": 8, "name": "Messager", "subtitle": "Les mots justes peuvent changer le destin.",
     "description": "Le Messager est le lien entre les équipages, les villages et les Anciens Gardiens. Rapide, discret et digne de confiance, il transporte les messages, les objets précieux et les informations essentielles.",
     "image_url": CHARTE_MESSAGER},
    {"order": 9, "name": "Chasseur de Trésors", "subtitle": "Les plus grands trésors racontent l'histoire des Anciens.",
     "description": "Le Chasseur de Trésors est un explorateur passionné. Il déchiffre les symboles anciens et reconnaît immédiatement les objets de valeur. Là où les autres voient un vieux coffre, il découvre une relique.",
     "image_url": CHARTE_CHASSEUR},
    {"order": 10, "name": "Alchimiste", "subtitle": "La nature offre ses secrets à ceux qui savent les comprendre.",
     "description": "L'Alchimiste est le savant de l'équipage. Il connaît les propriétés des plantes, des minéraux et des créatures marines. Grâce à ses mélanges, il crée des potions, des remèdes et des substances utiles.",
     "image_url": CHARTE_ALCHIMISTE},
]

DEFAULT_QUESTS = [
    {"order": 1, "title": "La Boussole de l'Amiral Disparu", "difficulty": "Facile", "location": "Port-du-Cormoran", "description": "Retrouver la boussole magnétique de l'Amiral Verane, cachée dans les caves de la taverne du Sextant Fêlé.", "reward": "300 doublons + Fragment de Relique"},
    {"order": 2, "title": "Le Chant des Sirènes Noires", "difficulty": "Moyen", "location": "Récif de la Veuve", "description": "Enquêter sur les disparitions nocturnes. Attention : les sirènes chantent en français ancien.", "reward": "Corne d'Alerte + 500 doublons"},
    {"order": 3, "title": "Le Coffre du Contrebandier", "difficulty": "Moyen", "location": "Île aux Deux Lunes", "description": "Ouvrir le coffre scellé par sept serrures. Six clés déjà trouvées. La septième est... quelque part.", "reward": "Épée du Contrebandier"},
    {"order": 4, "title": "La Marée des Infectés", "difficulty": "Difficile", "location": "Baie de l'Obsidienne", "description": "Repousser la première vague d'Infectés avant qu'elle n'atteigne les faubourgs.", "reward": "Titre : Défenseur de la Baie"},
    {"order": 5, "title": "L'Écho des Anciens", "difficulty": "Épique", "location": "Temple Englouti", "description": "Descendre dans le Temple Englouti et rapporter la première Relique majeure.", "reward": "Relique de l'Étoile Brisée"},
]

DEFAULT_JOURNAL = [
    {"date": "2026-03-12", "title": "Le Serment", "body": "La Confrérie a été refondée sous la Grande Lune. Sept capitaines ont prêté serment sur le Sablier de Corail."},
    {"date": "2026-04-02", "title": "Premier Écho", "body": "Une relique a émis un écho sur les côtes du Cormoran. Un Héritier y est envoyé."},
    {"date": "2026-05-18", "title": "La Marée Noire", "body": "Les premiers Infectés ont été aperçus. La Baie de l'Obsidienne a été fermée aux navires civils."},
]

DEFAULT_PASSPORT = [
    {"order": 1, "name": "Couverture", "description": "Couverture officielle du passeport de la Confrérie."},
    {"order": 2, "name": "Message des Anciens Gardiens", "description": "Parole transmise par les Anciens Gardiens à chaque Héritier."},
    {"order": 3, "name": "Serment", "description": "Serment prêté par tout membre de la Confrérie."},
    {"order": 4, "name": "Journal de Bord", "description": "Pages lignées pour vos entrées."},
    {"order": 5, "name": "Carte des Mers", "description": "Carte vierge à annoter."},
    {"order": 6, "name": "Registre des Reliques", "description": "Suivi des 10 reliques."},
    {"order": 7, "name": "Sceau de Guilde", "description": "Emplacement pour votre marque personnelle."},
]

PASSPORT_ASSETS = [
    # Real user-provided pages
    "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/x13rdvs8_Passeport-couverture",
    "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/cmn1ucae_Passeport-message%20des%20anciens%20gardiens",
    "https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/dh0fwxak_Passeport-serment",
    # Placeholders for remaining pages (to be replaced by the user)
    "https://images.pexels.com/photos/6039245/pexels-photo-6039245.jpeg",
    "https://images.pexels.com/photos/14436275/pexels-photo-14436275.jpeg",
    "https://images.pexels.com/photos/6485474/pexels-photo-6485474.jpeg",
    "https://images.unsplash.com/photo-1719563015025-83946fb49e49",
]


async def seed_db():
    if await db.world.count_documents({}) == 0:
        await db.world.insert_one(DEFAULT_WORLD)

    # Always re-seed classes to keep charter images / descriptions up to date
    needs_reseed = False
    cur = await db.classes.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    if len(cur) != len(DEFAULT_CLASSES):
        needs_reseed = True
    else:
        for existing, wanted in zip(cur, DEFAULT_CLASSES):
            if existing.get("name") != wanted["name"] or existing.get("image_url") != wanted["image_url"]:
                needs_reseed = True
                break
    if needs_reseed:
        await db.classes.delete_many({})
        docs = []
        for c in DEFAULT_CLASSES:
            docs.append({
                "id": str(uuid.uuid4()),
                "order": c["order"],
                "name": c["name"],
                "subtitle": c["subtitle"],
                "description": c["description"],
                "image_url": c["image_url"],
            })
        await db.classes.insert_many(docs)

    if await db.quests.count_documents({}) == 0:
        docs = [{"id": str(uuid.uuid4()), **q} for q in DEFAULT_QUESTS]
        await db.quests.insert_many(docs)

    if await db.journal.count_documents({}) == 0:
        docs = [{
            "id": str(uuid.uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            **e,
        } for e in DEFAULT_JOURNAL]
        await db.journal.insert_many(docs)

    if await db.passport.count_documents({}) == 0:
        docs = []
        for i, p in enumerate(DEFAULT_PASSPORT):
            docs.append({
                "id": str(uuid.uuid4()),
                "order": p["order"],
                "name": p["name"],
                "description": p["description"],
                "thumbnail_url": PASSPORT_ASSETS[i % len(PASSPORT_ASSETS)],
                "download_url": PASSPORT_ASSETS[i % len(PASSPORT_ASSETS)],
            })
        await db.passport.insert_many(docs)
    else:
        # Re-seed passport if names or URLs are outdated
        cur = await db.passport.find({}, {"_id": 0}).sort("order", 1).to_list(20)
        needs = len(cur) != len(DEFAULT_PASSPORT)
        if not needs:
            for i, existing in enumerate(cur):
                if (existing.get("name") != DEFAULT_PASSPORT[i]["name"]
                    or existing.get("thumbnail_url") != PASSPORT_ASSETS[i % len(PASSPORT_ASSETS)]):
                    needs = True
                    break
        if needs:
            await db.passport.delete_many({})
            docs = []
            for i, p in enumerate(DEFAULT_PASSPORT):
                docs.append({
                    "id": str(uuid.uuid4()),
                    "order": p["order"],
                    "name": p["name"],
                    "description": p["description"],
                    "thumbnail_url": PASSPORT_ASSETS[i % len(PASSPORT_ASSETS)],
                    "download_url": PASSPORT_ASSETS[i % len(PASSPORT_ASSETS)],
                })
            await db.passport.insert_many(docs)


@app.on_event("startup")
async def on_startup():
    await seed_db()


# ============ ROUTES ============
@api_router.get("/")
async def root():
    return {"message": "La Confrérie des Héritiers — API"}


@api_router.get("/world")
async def get_world():
    doc = await db.world.find_one({}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="World lore introuvable")
    return doc


@api_router.get("/classes")
async def get_classes():
    docs = await db.classes.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return docs


@api_router.post("/quests/verify")
async def verify_quests(payload: QuestPasswordRequest):
    if payload.password != QUESTS_PASSWORD:
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    docs = await db.quests.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return {"quests": docs}


@api_router.get("/journal")
async def get_journal():
    docs = await db.journal.find({}, {"_id": 0}).sort("date", -1).to_list(200)
    return docs


@api_router.post("/journal")
async def create_journal(entry: JournalEntryCreate, x_admin_password: Optional[str] = Header(None)):
    if x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Accès admin refusé")
    new = JournalEntry(**entry.dict())
    await db.journal.insert_one(new.dict())
    return new.dict()


@api_router.delete("/journal/{entry_id}")
async def delete_journal(entry_id: str, x_admin_password: Optional[str] = Header(None)):
    if x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Accès admin refusé")
    result = await db.journal.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entrée introuvable")
    return {"deleted": True}


@api_router.get("/passport")
async def get_passport():
    docs = await db.passport.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
