jq '[.[] | {Cs_d,PP_d,VOX,codigo_secc}]' censo-bueno.json > caida-pp.json
jq '[.[] | {UP_d,PSOE_d}]' censo-bueno.json > caida-up.json





jq '[.[] | .suma_Cs_Vox = .Cs_d + .VOX]' censo-bueno.json > censo-suma-vox.json


jq '[.[] | .total_izda = .UP_d - .PSOE_d]' caida-up.json > total-izda.json



jq '[(.[] | sort_by(.dist))]' censo-bueno.json > temp.json

jq -r '["up", "codigo_secc", "distrito"], (.[] | select(.UP_d) | [.UP_d, .codigo_secc, .dist]) | @csv' censo-bueno.json > up.csv

jq -r '["pp", "codigo_secc", "distrito"], (.[] | select(.PP_d) | [.PP_d, .codigo_secc, .dist]) | @csv' censo-bueno.json > pp.csv

jq -r '["psoe", "codigo_secc", "distrito"], (.[] | select(.PSOE_d) | [.PSOE_d, .codigo_secc, .dist]) | @csv' censo-bueno.json > psoe.csv

jq -r '["cs", "codigo_secc", "distrito"], (.[] | select(.Cs_d) | [.Cs_d, .codigo_secc, .dist]) | @csv' censo-bueno.json > cs.csv

jq -r '["vox", "codigo_secc", "distrito"], (.[] | select(.VOX) | [.VOX, .codigo_secc, .dist]) | @csv' censo-bueno.json > vox.csv

part

jq -r '["participacion", "ganador"], (.[] | select(.part >= 90) | [.part, .winner]) | @csv' censo-bueno.json > participacion.csv
