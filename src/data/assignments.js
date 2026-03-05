const STORAGE_KEY = 'hot-nuvotato-assignments';

const DEFAULT_ASSIGNMENTS = [
  'Ad je drankje!',
  'Neem 3 slokken!',
  'Lik iemands wang!',
  'Doe 3 push-ups!',
  'Neem een slok met je linkerhand!',
  'Doe een dansje van 5 seconden!',
  'Spel je naam achterstevoren!',
  'Geef iemand buiten de deelnemers een compliment!',
  'Doe je beste dierenimitatie!',
  'Doe alsof je een volleybal smasht en maak het geluid erbij!',
  'Doe een reclame na voor een willekeurig product!',
  'Vertel een mop - als niemand lacht, drink!',
  'Wissel van schoenen met de persoon links van je!',
  'Doe 5 jumping jacks!',
  'Maak een selfie met de persoon tegenover je!',
  'Geef de persoon rechts van je een high five met je voet!',
  'Doe je beste moonwalk!',
  'Ruil je glas met de persoon links van je!',
  'Noem een land zonder de letter "E"!',
  'Doe alsof je een vliegtuig bent dat crasht!',
  'Doe iemands lach na!',
  'Zeg drie keer foutloos: "De kat krabt de krullen van de trap"!',
  'Zeg "Coca Cola" zonder dat je lippen elkaar raken!',
  'Bedenk een rap van twee zinnen!',
  'Noem 3 groenten!',
  'Schrijf iets op je hand met je vinger, de persoon naast je moet raden wat!',
  'Doe de vogeltjesdans!',
  'Noem een vrouw!',
  'Fluister een geheim in het oor van de persoon links van je!',
  'Verklaar de liefde aan je drankje!',
  'Noem 3 woorden die rijmen op "bier"!',
  'Draai 10 rondjes!',
  'Geef de telefoon door zonder je handen te gebruiken!',
  'High five iemand van Heren 1!',
  'Sta 5 seconden stil...',
  'Doe alsof je en vulkaan bent die uitbarst!',
  'Noem 3 dieren met precies 4 letters!',
  'Noem 3 beroepen zonder de letter "R"!',
  'Noem 3 landen in Afrika!',
  'Noem 3 automerken!',
  'Noem een dier dat begint met de laatste letter van je naam!'
];

export function getAssignments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) { /* fall through to defaults */ }
  return [...DEFAULT_ASSIGNMENTS];
}

export function saveAssignments(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function resetAssignments() {
  localStorage.removeItem(STORAGE_KEY);
  return [...DEFAULT_ASSIGNMENTS];
}
