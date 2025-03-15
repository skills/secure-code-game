-- This file contains passing tests.

-- Run them by opening a terminal and running the following:
-- $ (cd Season-4/Level-1/ && lua tests.lua)

require 'busted.runner' ()
local code = require("code")


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
