var specialChar = {
	"문장 부호":["　","！","＇","，","．","／","：","；","？","＾","＿","｀","｜","￣","、","。","·","‥","…","¨","〃","­","―","∥","＼","∼","´","～","ˇ","˘","˝","˚","˙","¸","˛","¡","¿","ː"],
	"괄호":["＂","（","）","［","］","｛","｝","‘","’","“","”","〔","〕","〈","〉","《","》","「","」","『","』","【","】"],
	"수학 기호":["＋","－","＜","＝","＞","±","×","÷","≠","≤","≥","∞","∴","♂","♀","∠","⊥","⌒","∂","∇","≡","≒","≪","≫","√","∽","∝","∵","∫","∬","∈","∋","⊆","⊇","⊂","⊃","∪","∩","∧","∨","￢","⇒","⇔","∀","∃","∮","∑","∏"],
	"단위 기호":["＄","％","￦","Ｆ","′","″","℃","Å","￠","￡","￥","¤","℉","‰","€","㎕","㎖","㎗","ℓ","㎘","㏄","㎣","㎤","㎥","㎦","㎙","㎚","㎛","㎜","㎝","㎞","㎟","㎠","㎡","㎢","㏊","㎍","㎎","㎏","㏏","㎈","㎉","㏈","㎧","㎨","㎰","㎱","㎲","㎳","㎴","㎵","㎶","㎷","㎸","㎹","㎀","㎁","㎂","㎃","㎄","㎺","㎻","㎼","㎽","㎾","㎿","㎐","㎑","㎒","㎓","㎔","Ω","㏀","㏁","㎊","㎋","㎌","㏖","㏅","㎭","㎮","㎯","㏛","㎩","㎪","㎫","㎬","㏝","㏐","㏓","㏃","㏉","㏜","㏆"],
	"도형 문자":["＃","＆","＊","＠","§","※","☆","★","○","●","◎","◇","◆","□","■","△","▲","▽","▼","→","←","↑","↓","↔","〓","◁","◀","▷","▶","♤","♠","♡","♥","♧","♣","⊙","◈","▣","◐","◑","▒","▤","▥","▨","▧","▦","▩","♨","☏","☎","☜","☞","¶","†","‡","↕","↗","↙","↖","↘","♭","♩","♪","♬","㉿","㈜","№","㏇","™","㏂","㏘","℡","®","ª","º","㉾"],
	"괘선 문자":["─","│","┌","┐","┘","└","├","┬","┤","┴","┼","━","┃","┏","┓","┛","┗","┣","┳","┫","┻","╋","┠","┯","┨","┷","┿","┝","┰","┥","┸","╂","┒","┑","┚","┙","┖","┕","┎","┍","┞","┟","┡","┢","┦","┧","┩","┪","┭","┮","┱","┲","┵","┶","┹","┺","┽","┾","╀","╁","╃","╄","╅","╆","╇","╈","╉","╊"],
	"원문자·괄호문자 (한글)":["㉠","㉡","㉢","㉣","㉤","㉥","㉦","㉧","㉨","㉩","㉪","㉫","㉬","㉭","㉮","㉯","㉰","㉱","㉲","㉳","㉴","㉵","㉶","㉷","㉸","㉹","㉺","㉻","㈀","㈁","㈂","㈃","㈄","㈅","㈆","㈇","㈈","㈉","㈊","㈋","㈌","㈍","㈎","㈏","㈐","㈑","㈒","㈓","㈔","㈕","㈖","㈗","㈘","㈙","㈚","㈛"],
	"원문자·괄호문자 (영/숫자)":[	"ⓐ","ⓑ","ⓒ","ⓓ","ⓔ","ⓕ","ⓖ","ⓗ","ⓘ","ⓙ","ⓚ","ⓛ","ⓜ","ⓝ","ⓞ","ⓟ","ⓠ","ⓡ","ⓢ","ⓣ","ⓤ","ⓥ","ⓦ","ⓧ","ⓨ","ⓩ","①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩","⑪","⑫","⑬","⑭","⑮","⒜","⒝","⒞","⒟","⒠","⒡","⒢","⒣","⒤","⒥","⒦","⒧","⒨","⒩","⒪","⒫","⒬","⒭","⒮","⒯","⒰","⒱","⒲","⒳","⒴","⒵","⑴","⑵","⑶","⑷","⑸","⑹","⑺","⑻","⑼","⑽","⑾","⑿","⒀","⒁","⒂"],
	"전각 숫자 (아라비아/로마)":["０","１","２","３","４","５","６","７","８","９","ⅰ","ⅱ","ⅲ","ⅳ","ⅴ","ⅵ","ⅶ","ⅷ","ⅸ","ⅹ","Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","X"],
	"전각 숫자 (분수/첨자)":["½","⅓","⅔","¼","¾","⅛","⅜","⅝","⅞","¹","²","³","⁴","ⁿ","₁","₂","₃","₄"],
	"현대 한글 낱자":["ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄸ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅃ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ","ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"],
	"옛 한글 낱자":["ㅥ","ㅦ","ㅧ","ㅨ","ㅩ","ㅪ","ㅫ","ㅬ","ㅭ","ㅮ","ㅯ","ㅰ","ㅱ","ㅲ","ㅳ","ㅴ","ㅵ","ㅶ","ㅷ","ㅸ","ㅹ","ㅺ","ㅻ","ㅼ","ㅽ","ㅾ","ㅿ","ㆀ","ㆁ","ㆂ","ㆃ","ㆄ","ㆅ","ㆆ","ㆇ","ㆈ","ㆉ","ㆊ","ㆋ","ㆌ","ㆍ","ㆎ"],
	"전각 로마자":["Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ","ａ","ｂ","ｃ","ｄ","ｅ","ｆ","ｇ","ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ","ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ","ｖ","ｗ","ｘ","ｙ","ｚ"],
	"그리스 문자":["Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Ι","Κ","Λ","Μ","Ν","Ξ","Ο","Π","Ρ","Σ","Τ","Υ","Φ","Χ","Ψ","Ω","α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"],
	"서유럽/라틴 문자":["Æ","Ð","Ħ","Ĳ","Ŀ","Ł","Ø","Œ","Þ","Ŧ","Ŋ","æ","đ","ð","ħ","ı","ĳ","ĸ","ŀ","ł","ø","œ","ß","þ","ŧ","ŋ","ŉ"],
	"히라가나":["ぁ","あ","ぃ","い","ぅ","う","ぇ","え","ぉ","お","か","が","き","ぎ","く","ぐ","け","げ","こ","ご","さ","ざ","し","じ","す","ず","せ","ぜ","そ","ぞ","た","だ","ち","ぢ","っ","つ","づ","て","で","と","ど","な","に","ぬ","ね","の","は","ば","ぱ","ひ","び","ぴ","ふ","ぶ","ぷ","へ","べ","ぺ","ほ","ぼ","ぽ","ま","み","む","め","も","ゃ","や","ゅ","ゆ","ょ","よ","ら","り","る","れ","ろ","ゎ","わ","ゐ","ゑ","を","ん"],
	"가타카나":["ァ","ア","ィ","イ","ゥ","ウ","ェ","エ","ォ","オ","カ","ガ","キ","ギ","ク","グ","ケ","ゲ","コ","ゴ","サ","ザ","シ","ジ","ス","ズ","セ","ゼ","ソ","ゾ","タ","ダ","チ","ヂ","ッ","ツ","ヅ","テ","デ","ト","ド","ナ","ニ","ヌ","ネ","ノ","ハ","バ","パ","ヒ","ビ","ピ","フ","ブ","プ","ヘ","ベ","ペ","ホ","ボ","ポ","マ","ミ","ム","メ","モ","ャ","ヤ","ュ","ユ","ョ","ヨ","ラ","リ","ル","レ","ロ","ヮ","ワ","ヰ","ヱ","ヲ","ン","ヴ","ヵ","ヶ"],
	"키릴 문자":["А","Б","В","Г","Д","Е","Ё","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я","а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"],
	"하트": ["💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "💔", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "♥", "♡", "❤", "❥", "❦", "❧", "❣", "൱", "ෆ", "ꯁ", "ဣ", "დ", "ღ", "ო", "ᦂ", "ᨻ", "ᰔ", "ꢭ", "ꨁ", "ඨ", "ධ", "۵", "ದ", "𑚥", "ꪑ", "🝮", "ऌॢ","ᰔᩚ", "♡̴", "♡̶", "♡⃛", "♡⃜", "ෆ̇", "ෆ̈", "ෆ⃛", "ෆ⃜", "♡̷̷̷", "♡̷̷̷ྉ", "˗ˋˏ ♡ ˎˊ˗", "˗ˋˏ ♡̷̷̷ ˎˊ˗", "♡⁼³₌₃", "—̳͟͞͞♡", "—̳͟͞͞♥", "⸜❤︎⸝‍", "˛ε♡з¸", "ʚ♥⃛ɞ", ".•♥", " ̩˳♡⃝", "❥⃝", "˚ෆ*₊", "॰｡ཻ˚♡", "˝˚³♥³˚˝", "˚ ༘♡ ⋆｡˚", "┈༝༚༝༚♡ﾞ","߮߰🖤߮߬ ⃕","⑉♥","❥･•","♡ʾʾ","♡ᵎᵎᵎ","෴❤෴","༺♥༻","ᥫ᭡","ꦿ᭄","ััꦿ᭄","",""],
	"별": ["⭐","🌟","🌠","🔯","✨","★","☆","🜸","🜚","≛","⋆","⍟","⍣","✡","✦","✧","✪","✫","✬","✯","✰","✴","✵","✶","✷","✸","✹","❂","⭑","⭒","✰","✮","۞","𖤐","⛤","⛥","⛦","⛧",""],
	"꽃": ["💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌷","🌼","✿","❀","❁","𑁍","✾","ꕤ","ꕥ","᪥"],
	"십자가": ["†","ߙ","✝","✞","✟","☩","☦","☨","♰","♱","✚","✠"],
	"물음표": ["❓","❔","␦","؟","⸮","﹖","‽","︖","？","🙻","🙹","🙺","?"],
	"왕관": ["👑","♔","♕","♚","♛","🜲","亗","〨"],
	"스마일": ["◡̈","◡̎","◠̈","ᯅ̈","◟́◞̀","◟̄◞̄","◟̆◞̆","◟̊◞̊","◟̑◞̑","◟̽◞̽  ༘*","∵⃝","⌣̈⃝","⍢⃝","⍣⃝","⍤⃝","⍥⃝","⍨⃝","⍩⃝","◡̈⃝","⠒̫⃝","⌓̈⃝",""],
	"기타": ["๑","𖦹","꩜","۝","۞","๛","៚","〠","𖤐","𖠌","𖧵","⚘","⚜","⌕","⏃","ꗃ","𐀔","﷽",".ᐟ","ᯤ","☥","ᝰ","ᜰ","𑜸","𑜷","𑑛","�","",""],
	"공백": ["​"," "," "," "," "," "," "," "," ","⠀"," "]
}	