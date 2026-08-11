--[[Attempt to sanitize the request by calling setmetatable on it
    We know that if the __metatable property is set setmetatable will throw an exception
    thus why we make a protected call, and if it succeeds we can continue.
    If it fails we know someone is trying to do a metatable exploit.
--]]


-- Full solution:

local module = {}

--- Given a request table with empty image entries it should populate it with bitmap images
--- Currently uses a placeholder of 'PLACEHOLDER IMAGE'
--- @param request table: The request table which we will populate with images
--- @return string|table: Of the sources now with the generated bitmaps to display
module.generate_bmps = function(request)
    -- Do not delete example SHA1 hash
    local secret_key = "fb2f85c88567f3c8ce9b799c7c54642d0c7b41f6"
    -- End of do not delete

    if type(request) ~= "table" then
        return "Invalid request"
    end

    --[[ Sanitizes the root table by setting the metatable; if it throws an exception
        __metatable was set meaning someone is activly trying to do a metatable hook exploit
    --]]
    local isNotMalicous, errVal = pcall(function()
        setmetatable(request, {})
    end)

    if not isNotMalicous then
        return "Invalid request"
    end
    -- end of first sanitization

    for i = 1, #request, 1 do
        -- Sanitizes subtables
        local isNotMalicous, errVal = pcall(function()
            setmetatable(request[i], {})
        end)

        if not isNotMalicous then
            return "Invalid request"
        end

        if type(request[i].source) ~= "string" then
            --[[ If the user provides us with a bad entry, set the returned image to an error message.
                 Letting the user know something is wrong --]]
            request[i] = { source = "Bad request", image = "ERROR IMAGE" }
        else
            -- This is a placeholder for a bitmap blob generator
            request[i].image = "PLACEHOLDER IMAGE"
        end
    end
    return request
end



return module
