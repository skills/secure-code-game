-- This file exploits the vulnerabilities in code. Running this file will fail initially
-- (it contains failing tests). As all other levels, your goal is to get this file to pass.

-- Run them by opening a terminal and running the following:
-- $ (cd Season-3/Level-1/ && lua hack.lua)

local code = require("code")


local indexHookExploit = function()
    local malicous_code_executed = false

    local malicous_metatable = {
        __metatable = {},
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

    if type(result) == "table" and result.recieving_payload ~= nil then
        print("Malicous payload recieved: ", result.recieving_payload)
    end

    print(not malicous_code_executed)
end

local lengthHookExploit = function()
    local malicous_code_executed = false

    local malicous_metatable = {
        __metatable = {},
        __len = function(og_table)
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

            return 3
        end
    }

    local odd_request = {
        { source = "Legit link",                image = nil },
        { source = "Another legit link",        image = nil },
        { source = "Another legit boring link", image = nil }
    }
    local malicous_metatable = setmetatable(odd_request, malicous_metatable)
    local result = code.generate_bmps(malicous_metatable)

    if type(result) == "table" and result.recieving_payload ~= nil then
        print("Malicous payload recieved: ", result.recieving_payload)
    end

    print(not malicous_code_executed)
end

lengthHookExploit()
indexHookExploit()
