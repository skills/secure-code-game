-- This file exploits the vulnerabilities in code. Running this file will fail initially
-- (it contains failing tests). As all other levels, your goal is to get this file to pass.

-- Run them by opening a terminal and running the following:
-- $ (cd Season-4/Level-1/ && lua hack.lua)

require 'busted.runner' ()

local code = require("code")


--- This function sends a malicous request, and returns
--- the result given by the code.
--- @return table | string: the resulting response
local index_hook_exploit = function()
    local malicous_metatable = {
        __metatable = {},
        __index = function(original_table, index)
            print("[SCRIPT EXECUTING]")
            local variables = {}
            local varIndex = 1
            while true do
                -- extracts a local variables down 2 from the call stack
                local extractedVarIndex, extractedVal = debug.getlocal(2, varIndex)
                if extractedVarIndex ~= nil then
                    variables[extractedVarIndex] = extractedVal
                else
                    break
                end
                varIndex = 1 + varIndex
            end

            original_table.success = false
            original_table.recieving_payload = variables["secret_key"]

            return "Hook executed"
        end
    }

    -- Requests shouldn't have nil values but nothing about this table is malicous
    local odd_request = { { source = "Link 1", image = nil }, nil, { source = "Link 2", image = nil } }

    -- We exploit the fact that when you try to index a nil value in a table the metatable will be called
    local malicous_request = setmetatable(odd_request, malicous_metatable)
    local result = code.generate_bmps(malicous_request)

    if type(result) == "table" and result.recieving_payload ~= nil then
        print("Malicous payload recieved: ", result.recieving_payload)
    end

    return result
end


describe("Does it reject a table with hooks", function()
    it("it should give us a 'Invalid request'", function()
        assert.are.equals("Invalid request", index_hook_exploit())
    end)
end)
