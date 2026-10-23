# Review previews (CS-011)
Put preview shots in approvals/previews/<request id>/ (served by GitHub Pages, so they load on the live site) and list them in approvals/previews.json:
{"CR-0003":{"after":[{"label":"Desktop","url":"approvals/previews/CR-0003/desktop.png"},{"label":"Phone","url":"approvals/previews/CR-0003/phone.png"}],"before":[],"pr":"https://github.com/..."}}
"before" is optional: the requester's own screenshots are kept on their device at submit.
