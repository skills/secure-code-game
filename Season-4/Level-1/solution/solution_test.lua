-- Run solution_test.lua by following the instructions below:

-- This file is a copy of tests.lua and hack.lua
-- It tests the solution for failing and passing payloads
-- This file should always pass as it is testing the solution

-- Run them by opening a terminal and running the following:
-- $ (cd Season-4/Level-1/solution && lua solution_test.lua)

require 'busted.runner' ()
local code = require("solution")


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


-- Given a normal request does it return the proper placeholder image
local does_it_handle_requests = function()
    local our_normal_request = {
        { source = "Link 1", image = nil },
        { source = "Link 2", image = nil },
        { source = "Link 3", image = nil }
    }

    local result = code.generate_bmps(our_normal_request)

    return result
end


-- Given a malformed request does it handle it gracefully
local does_it_hanlde_malformed_requests = function()
    local our_normal_request = {
        { source = "Link 1", image = nil },
        { source = 1,        image = nil },
        { source = "Link 3", image = nil }
    }



    local result = code.generate_bmps(our_normal_request)

    return result
end

describe("Does it handle requests properly", function()
    it("should return a populated table", function()
        local expected_result = {
            { source = "Link 1", image = "PLACEHOLDER IMAGE" },
            { source = "Link 2", image = "PLACEHOLDER IMAGE" },
            { source = "Link 3", image = "PLACEHOLDER IMAGE" }
        }
        assert.are.same(expected_result, does_it_handle_requests())
    end)
end)

describe("Does it handle malformed requests properly", function()
    it("should return a populated table with a bad image entry", function()
        local expected_result = {
            { source = "Link 1",      image = "PLACEHOLDER IMAGE" },
            { source = "Bad request", image = "ERROR IMAGE" },
            { source = "Link 3",      image = "PLACEHOLDER IMAGE" }
        }
        assert.are.same(expected_result, does_it_hanlde_malformed_requests())
    end)
end)

describe("Does it reject a table with hooks", function()
    it("it should give us a 'Invalid request'", function()
        assert.are.equals("Invalid request", index_hook_exploit())
    end)
end)
