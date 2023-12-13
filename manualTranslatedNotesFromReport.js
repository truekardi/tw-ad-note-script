var ScriptData = {
    name: "Auto notes from report",
    version: "v2.1",
    lastUpdate: "2021-03-07",
    author: "xdam98",
    authorContact: "Xico#7941 (Discord)"
},
LS_prefix = "xd",
translations = {
    pt_PT: {
        unknown: "Desconhecido",
        verifyReportPage: "O Script deve ser utilizado dentro de um relatĂłrio",
        offensive: "Ofensiva",
        defensive: "Defensiva",
        probOffensive: "Provavelmente Ofensiva",
        probDefensive: "Provavelmente Defensiva",
        noSurvivors: "Nenhuma tropa sobreviveu",
        watchtower: "Torre ",
        wall: "Muralha ",
        firstChurch: "Igreja Principal",
        church: "Igreja ",
        defensiveNukes: " fulls defesa",
        noteCreated: "Nota criada",
        addReportTo: "Colocar relatĂłrio no:",
        attacker: "Atacante",
        defender: "Defensor"
    },
    en_DK: {
        unknown: "Unknown",
        verifyReportPage: "This script can only be run on a report screen.",
        offensive: "Offensive",
        defensive: "Defensive",
        probOffensive: "Probably Offensive",
        probDefensive: "Probably Defensive",
        noSurvivors: "No troops survived",
        watchtower: "Watchtower ",
        wall: "Wall ",
        firstChurch: "First church",
        church: "Church ",
        defensiveNukes: " deffensive nukes",
        noteCreated: "Note created",
        addReportTo: "Add report to which village:",
        attacker: "Attacker",
        defender: "Defender"
    },
    en_US: {
        unknown: "Unknown",
        verifyReportPage: "This script can only be run on a report screen.",
        offensive: "Offensive",
        defensive: "Defensive",
        probOffensive: "Probably Offensive",
        probDefensive: "Probably Defensive",
        noSurvivors: "No troops survived",
        watchtower: "Watchtower ",
        wall: "Wall ",
        firstChurch: "First church",
        church: "Church ",
        defensiveNukes: " deffensive nukes",
        noteCreated: "Note created",
        addReportTo: "Add report to which village:",
        attacker: "Attacker",
        defender: "Defender"
    },
    cs_CZ: {
        unknown: "Nezjištěno",
        verifyReportPage: "Tento skript lze spustit pouze na oznámení.",
        offensive: "OFF",
        defensive: "DEF",
        probOffensive: "Pravděpodobně OFF",
        probDefensive: "Pravděpodobně DEF",
        noSurvivors: "Žádné jednotky nepřežily",
        watchtower: "Strážní věž ",
        wall: "Hradby ",
        firstChurch: "První kostel",
        church: "Kostel ",
        defensiveNukes: " Seláků Obrany",
        noteCreated: "Poznámka založena",
        addReportTo: "Přidat oznámení do vesnice:",
        attacker: "Útočníka",
        defender: "Obránce"
    },
    ro_RO: {
        unknown: "Unknown",
        verifyReportPage: "This script can only be run on a report screen.",
        offensive: "Offensive",
        defensive: "Defensive",
        probOffensive: "Probably Offensive",
        probDefensive: "Probably Defensive",
        noSurvivors: "No troops survived",
        watchtower: "Watchtower ",
        wall: "Wall ",
        firstChurch: "First church",
        church: "Church ",
        defensiveNukes: " deffensive nukes",
        noteCreated: "Note created",
        addReportTo: "Add report to which village:",
        attacker: "Attacker",
        defender: "Defender"
    },
    pl_PL: {
        unknown: "Nieznany",
        verifyReportPage: "Ten skrypt moĹĽna uruchomiÄ‡ tylko na ekranie raportu.",
        offensive: "Ofensywna",
        defensive: "Defensywna",
        probOffensive: "Prawdopodobnie Ofensywna",
        probDefensive: "Prawdopodobnie Defensywna",
        noSurvivors: "Ĺ»adne wojska nie przeĹĽyĹ‚y",
        watchtower: "WieĹĽa straĹĽnicza ",
        wall: "Mur ",
        firstChurch: "Pierwszy koĹ›ciĂłĹ‚",
        church: "KoĹ›ciĂłĹ‚ ",
        defensiveNukes: " bunkier",
        noteCreated: "Utworzono notatkÄ™",
        addReportTo: "Dodaj raport do ktĂłrej wioski:",
        attacker: "Napastnik",
        defender: "Obrońca"
    }
},
_t = a => null != translations[game_data.locale] ? translations[game_data.locale][a] : translations.pt_PT[a],
initializeTranslations = () => localStorage.getItem(`${LS_prefix}_langWarning`) ? 1 : (void 0 === translations[game_data.locale] && UI.ErrorMessage(`No translation found for <b>${game_data.locale}</b>.`, 3e3), localStorage.setItem(`${LS_prefix}_langWarning`, 1), 0);
CriarRelatorioNotas = {
    data: {
        player: {
            nomePlayer: game_data.player.name,
            playerEstaAtacar: !1,
            playerEstaDefender: !1,
            playerQuerInfoAtacante: !1,
            playerQuerInfoDefensor: !1
        },
        aldeia: {
            ofensiva: {
                idAldeia: "-1",
                tipoAldeia: _t("unknown"),
                tropas: {
                    totais: [],
                    ofensivas: 0,
                    defensivas: 0
                }
            },
            defensiva: {
                idAldeia: "-1",
                tipoAldeia: _t("unknown"),
                tropas: {
                    visiveis: !1,
                    totais: [],
                    fora: {
                        visiveis: !1,
                        ofensivas: 0,
                        defensivas: 0,
                        totais: []
                    },
                    dentro: {
                        ofensivas: 0,
                        defensivas: 0,
                        totais: []
                    },
                    apoios: 0
                },
                edificios: {
                    edificiosVisiveis: !1,
                    torre: [!1, 0],
                    igrejaPrincipal: [!1, 0],
                    igreja: [!1, 0],
                    muralha: [!1, 0]
                }
            }
        },
        world: {
            fazendaPorTropa: [],
            arqueirosAtivos: !1
        }
    },
    confuguration: {
        esconderTropas: !1
    },
    verificarPagina: function() {
        var a = window.location.href.match(/(screen\=report){1}|(view\=){1}\w+/g);
        return !(!a || 2 != a.length) || (UI.ErrorMessage(_t("verifyReportPage"), 5e3), !1)
    },
    initConfigs: function() {
        this.confuguration.esconderTropas = this.loadLSConfig("esconderTropas", !1)
    },
    loadLSConfig: (a, e) => localStorage.getItem(`${LS_prefix}_${a}`) ?? e,
    initializeDataScript: function() {
        var a = this;
        this.data.world.arqueirosAtivos = game_data.units.includes("archer"), this.data.world.arqueirosAtivos ? (this.data.aldeia.ofensiva.tropas.totais = new Array(10).fill(0), this.data.aldeia.defensiva.tropas.totais = new Array(10).fill(0), this.data.aldeia.defensiva.tropas.fora.totais = new Array(10).fill(0), this.data.aldeia.defensiva.tropas.dentro.totais = new Array(10).fill(0), this.data.world.fazendaPorTropa = [1, 1, 1, 1, 2, 4, 5, 6, 5, 8]) : (this.data.aldeia.ofensiva.tropas.totais = new Array(8).fill(0), this.data.aldeia.defensiva.tropas.totais = new Array(8).fill(0), this.data.aldeia.defensiva.tropas.fora.totais = new Array(8).fill(0), this.data.aldeia.defensiva.tropas.dentro.totais = new Array(8).fill(0), this.data.world.fazendaPorTropa = [1, 1, 1, 2, 4, 6, 5, 8]);
        var e = $("#attack_info_att > tbody > tr:nth-child(1) > th:nth-child(2) > a").text(),
            i = $("#attack_info_def > tbody > tr:nth-child(1) > th:nth-child(2) > a").text(),
            s = 3;
        "0" != game_data.player.sitter && (s = 4), a.data.aldeia.ofensiva.idAldeia = $("#attack_info_att > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)").url().split("=")[s], a.data.aldeia.defensiva.idAldeia = $("#attack_info_def > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)").url().split("=")[s], i == this.data.player.nomePlayer ? this.data.player.playerEstaDefender = !0 : e == this.data.player.nomePlayer && (this.data.player.playerEstaAtacar = !0), $("#attack_spy_away > tbody > tr:nth-child(1) > th").length && (this.data.aldeia.defensiva.tropas.fora.visiveis = !0, this.data.world.arqueirosAtivos ? $("#attack_spy_away > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td").each((function(e, i) {
            var s = parseInt(i.textContent);
            e < a.data.aldeia.defensiva.tropas.totais.length && (a.data.aldeia.defensiva.tropas.fora.totais[e] = s), 2 == e || 5 == e || 6 == e || 8 == e ? a.data.aldeia.defensiva.tropas.fora.ofensivas += s * a.data.world.fazendaPorTropa[e] : 0 != e && 1 != e && 3 != e && 7 != e && 9 != e || (a.data.aldeia.defensiva.tropas.fora.defensivas += s * a.data.world.fazendaPorTropa[e])
        })) : $("#attack_spy_away > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td").each((function(e, i) {
            var s = parseInt(i.textContent);
            e < a.data.aldeia.defensiva.tropas.totais.length && (a.data.aldeia.defensiva.tropas.fora.totais[e] = s), 2 == e || 4 == e || 6 == e ? a.data.aldeia.defensiva.tropas.fora.ofensivas += s * a.data.world.fazendaPorTropa[e] : 0 != e && 1 != e && 5 != e && 7 != e || (a.data.aldeia.defensiva.tropas.fora.defensivas += s * a.data.world.fazendaPorTropa[e])
        }))), $("#attack_info_def_units > tbody > tr:nth-child(2) > td").length && (this.data.aldeia.defensiva.tropas.visiveis = !0), this.data.world.arqueirosAtivos ? (this.data.aldeia.defensiva.tropas.visiveis && $("#attack_info_def_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e, i) {
            var s = parseInt(i.textContent);
            e < a.data.aldeia.defensiva.tropas.totais.length && (a.data.aldeia.defensiva.tropas.dentro.totais[e] = s), 2 == e || 5 == e || 6 == e || 8 == e ? a.data.aldeia.defensiva.tropas.dentro.ofensivas += s * a.data.world.fazendaPorTropa[e] : 0 != e && 1 != e && 3 != e && 7 != e && 9 != e || (a.data.aldeia.defensiva.tropas.dentro.defensivas += s * a.data.world.fazendaPorTropa[e])
        })), $("#attack_info_att_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e, i) {
            var s = parseInt(i.textContent);
            e < a.data.aldeia.ofensiva.tropas.totais.length && (a.data.aldeia.ofensiva.tropas.totais[e] = s), 2 == e || 5 == e || 6 == e ? a.data.aldeia.ofensiva.tropas.ofensivas += s * a.data.world.fazendaPorTropa[e] : 0 != e && 1 != e && 3 != e && 7 != e && 9 != e || (a.data.aldeia.ofensiva.tropas.defensivas += s * a.data.world.fazendaPorTropa[e])
        }))) : (this.data.aldeia.defensiva.tropas.visiveis && $("#attack_info_def_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e, i) {
            var s = parseInt(i.textContent);
            e < a.data.aldeia.defensiva.tropas.totais.length && (a.data.aldeia.defensiva.tropas.dentro.totais[e] = s), 2 == e || 4 == e || 6 == e ? a.data.aldeia.defensiva.tropas.dentro.ofensivas += s * a.data.world.fazendaPorTropa[e] : 0 != e && 1 != e && 5 != e && 7 != e || (a.data.aldeia.defensiva.tropas.dentro.defensivas += s * a.data.world.fazendaPorTropa[e])
        })), $("#attack_info_att_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e, i) {
            var s = parseInt(i.textContent);
            e < a.data.aldeia.ofensiva.tropas.totais.length && (a.data.aldeia.ofensiva.tropas.totais[e] = s), 2 == e || 4 == e || 6 == e ? a.data.aldeia.ofensiva.tropas.ofensivas += s * a.data.world.fazendaPorTropa[e] : 0 != e && 1 != e && 5 != e && 7 != e || (a.data.aldeia.ofensiva.tropas.defensivas += s * a.data.world.fazendaPorTropa[e])
        }))), $("#attack_spy_buildings_left > tbody > tr:nth-child(1) > th:nth-child(1)").length && (this.data.aldeia.defensiva.edificios.edificiosVisiveis = !0, $("table[id^='attack_spy_buildings_'] > tbody > tr:gt(0) > td > img").each((function(e, i) {
            var s = i.src.split("/")[7].replace(".png", ""),
                t = parseInt(i.parentNode.parentNode.childNodes[3].textContent);
            "watchtower" == s ? a.data.aldeia.defensiva.edificios.torre = [!0, t] : "church_f" == s ? a.data.aldeia.defensiva.edificios.igrejaPrincipal = [!0, t] : "church" == s ? a.data.aldeia.defensiva.edificios.igreja = [!0, t] : "wall" == s && (a.data.aldeia.defensiva.edificios.muralha = [!0, t])
        })))
    },
    getTipoAldeia: function() {
        this.data.aldeia.defensiva.tropas.visiveis ? (this.data.aldeia.defensiva.tropas.dentro.ofensivas > 3e3 ? this.data.aldeia.defensiva.tipoAldeia = _t("offensive") : this.data.aldeia.defensiva.tropas.dentro.ofensivas > 500 ? this.data.aldeia.defensiva.tipoAldeia = _t("probOffensive") : this.data.aldeia.defensiva.tropas.dentro.defensivas > 1e3 ? this.data.aldeia.defensiva.tipoAldeia = _t("defensive") : this.data.aldeia.defensiva.tropas.dentro.defensivas > 500 && (this.data.aldeia.defensiva.tipoAldeia = _t("probDefensive")), this.data.aldeia.defensiva.tropas.apoios = Math.round(this.data.aldeia.defensiva.tropas.dentro.defensivas / 2e4 * 10) / 10) : this.data.aldeia.defensiva.tropas.visiveis || (this.data.aldeia.defensiva.tipoAldeia = _t("noSurvivors")), this.data.aldeia.defensiva.tropas.fora.visiveis && (this.data.aldeia.defensiva.tropas.fora.ofensivas > 3e3 ? this.data.aldeia.defensiva.tipoAldeia = _t("offensive") : this.data.aldeia.defensiva.tropas.fora.ofensivas > 1e3 ? this.data.aldeia.defensiva.tipoAldeia = _t("probOffensive") : this.data.aldeia.defensiva.tropas.fora.defensivas > 1e3 ? this.data.aldeia.defensiva.tipoAldeia = _t("defensive") : this.data.aldeia.defensiva.tropas.fora.defensivas > 500 ? this.data.aldeia.defensiva.tipoAldeia = _t("probDefensive") : this.data.aldeia.defensiva.tropas.fora.defensivas + this.data.aldeia.defensiva.tropas.fora.ofensivas > 1e3 && (this.data.aldeia.defensiva.tropas.fora.ofensivas > this.data.aldeia.defensiva.tropas.fora.defensivas ? this.data.aldeia.defensiva.tipoAldeia = _t("probOffensive") : this.data.aldeia.defensiva.tropas.fora.defensivas >= this.data.aldeia.defensiva.tropas.fora.ofensivas && (this.data.aldeia.defensiva.tipoAldeia = _t("probDefensive"))), this.data.aldeia.defensiva.tropas.apoios += Math.round(this.data.aldeia.defensiva.tropas.fora.defensivas / 2e4 * 10) / 10), this.data.aldeia.ofensiva.tropas.ofensivas > this.data.aldeia.ofensiva.tropas.defensivas ? this.data.aldeia.ofensiva.tipoAldeia = _t("offensive") : this.data.aldeia.ofensiva.tropas.ofensivas < this.data.aldeia.ofensiva.tropas.defensivas && (this.data.aldeia.ofensiva.tipoAldeia = _t("defensive"))
    },
    geraTextoNota: function() {
        var a, e = $("#report_export_code").text(),
            i = $("#content_value > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2)").text().replace(/\s+/g, " ").replace(/.{5}$/g, ""),
            s = "";
        return (this.data.player.playerEstaAtacar || this.data.player.playerQuerInfoDefensor) && (a = this.data.aldeia.defensiva.tipoAldeia), this.data.player.playerEstaAtacar && !this.data.player.playerQuerInfoAtacante || (a = this.data.aldeia.ofensiva.tipoAldeia), !this.data.player.playerEstaAtacar && this.data.player.playerQuerInfoDefensor && (a = this.data.aldeia.defensiva.tipoAldeia), s += " | [color=#" + (a == _t("offensive") || a == _t("probOffensive") ? "ff0000" : "0eae0e") + "][b]" + a + "[/b][/color] | ", (this.data.player.playerEstaAtacar || this.data.player.playerQuerInfoDefensor) && (this.data.aldeia.defensiva.edificios.torre[0] && (s += "[building]watchtower[/building] " + _t("watchtower") + this.data.aldeia.defensiva.edificios.torre[1] + " | "), this.data.aldeia.defensiva.edificios.muralha[0] && (s += "[building]wall[/building][color=#5c3600][b] " + _t("wall") + this.data.aldeia.defensiva.edificios.muralha[1] + "[/b][/color] | "), this.data.aldeia.defensiva.edificios.igrejaPrincipal[0] && (s += "[building]church_f[/building] " + _t("firstChurch") + " | "), this.data.aldeia.defensiva.edificios.igreja[0] && (s += "[building]church_f[/building] " + _t("church") + this.data.aldeia.defensiva.edificios.igreja[1] + " | "), this.data.aldeia.defensiva.tropas.visiveis && a != _t("offensive") && a != _t("probOffensive") && (s += this.data.aldeia.defensiva.tropas.apoios + _t("defensiveNukes") + " | ")), s += "[b][size=6]xD[/size][/b]", s += "\n\n[b]" + i + "[/b]", s += "" + e
    },
    escreveNota: function() {
        var a, e, i = this,
            s = "";
        if (s = this.data.player.playerEstaAtacar || this.data.player.playerQuerInfoDefensor ? parseInt(this.data.aldeia.defensiva.idAldeia) : parseInt(this.data.aldeia.ofensiva.idAldeia), e = "0" == game_data.player.sitter ? "https://" + location.hostname + "/game.php?village=" + game_data.village.id + "&screen=api&ajaxaction=village_note_edit&h=" + game_data.csrf + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3) : "https://" + location.hostname + "/game.php?village=" + game_data.village.id + "&screen=api&ajaxaction=village_note_edit&t=" + game_data.player.id, this.data.player.playerEstaAtacar || this.data.player.playerEstaDefender) a = i.geraTextoNota(), $.post(e, {
            note: a,
            village_id: s,
            h: game_data.csrf
        }, (function(a) {
            UI.SuccessMessage(_t("noteCreated"), 2e3)
        }));
        else {
            var t = $('<div class="center"> ' + _t("addReportTo") + " </div>"),
                d = $('<div class="center"><button class="btn btn-confirm-yes atk">' + _t("attacker") + '</button><button class="btn btn-confirm-yes def">' + _t("defender") + "</button></div>"),
                o = t.add(d);
            Dialog.show("relatorio_notas", o), d.find("button.atk").click((function() {
                i.data.player.playerQuerInfoAtacante = !0, a = i.geraTextoNota(), $.post(e, {
                    note: a,
                    village_id: i.data.aldeia.ofensiva.idAldeia,
                    h: game_data.csrf
                }, (function(a) {
                    UI.SuccessMessage(_t("noteCreated"), 2e3)
                })), Dialog.close()
            })), d.find("button.def").click((function() {
                i.data.player.playerQuerInfoDefensor = !0, a = i.geraTextoNota(), $.post(e, {
                    note: a,
                    village_id: i.data.aldeia.defensiva.idAldeia,
                    h: game_data.csrf
                }, (function(a) {
                    UI.SuccessMessage(_t("noteCreated"), 2e3)
                })), Dialog.close()
            }))
        }
    },
    start: function() {
        this.verificarPagina() && (this.initializeDataScript(), this.getTipoAldeia(), this.escreveNota())
    }
}, initializeTranslations() ? CriarRelatorioNotas.start() : setTimeout((() => {
CriarRelatorioNotas.start();
}), 3e3), $.getJSON("https://api.countapi.xyz/hit/xdamScripts/scriptCriarNotaRelatorio");