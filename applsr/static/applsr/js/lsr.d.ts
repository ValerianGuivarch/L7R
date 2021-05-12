type JEMP = `Jemp-${string}`;
type RollTypeBackend = 'Jsoin' | 'JM' | 'JAF' | 'JAS' | 'JAE' | 'JC' | 'JS' | 'JE' | 'Jmort' | JEMP;
type CharId = string;

type Stat = "pv" | "arcanes" | "dettes" | "pf" | "pp" | "ben" | "mal";


type RollType = "flesh" | "spirit" | "essence" | "death" | "magic" | "heal" | "empirical" | "arcana" | "arcana-spirit" | "arcana-essence";


type Action = "+" | "-" | "--" | "++" | "Edit";


type Thing = "name" | "title" | "level" | "portrait" | "flesh" | "spirit" | "essence" | "lux" | "umbra" | "secunda" | "hp" | "debt" | "arcana" | "focus" | "power" | "curse" | "curse2" | "blessing" | "proficiency" | "secret" | "notes" | "category";


interface CharacterFromDatabase {
    id: number,
    name: string,
    titre: string,
    niveau: number,
    element: string,
    force1: string,
    force2: string | null,
    chair: number,
    esprit: number,
    essence: number,
    point_de_vie: number,
    point_de_vie_max: number,
    point_de_focus: number,
    point_de_focus_max: number,
    point_de_pouvoir: number,
    point_de_pouvoir_max: number,
    dettes: number,
    arcanes: number,
    arcanes_max: number,
    /** lux */
    fl: string,
    /** umbra */
    fu: string,
    /** secunda */
    fs: string,
    notes: string | undefined,
    category: string,
}


interface Roll {
    id: number,
    date: string, // 2021-05-02T18:03:41.551Z
    secret: boolean,
    character: string,
    malediction_count: number,
    benediction_count: number,
    dice_results: number[],
    pp: boolean,
    pf: boolean,
    ra: boolean,
    hidden_dice: boolean,
    roll_type: RollTypeBackend,
    parent_roll?: Roll,
    related_rolls: Roll[]
}


interface ChatHistory {
    "update": string, // iso datetime
    "rolls": Roll[]
}
