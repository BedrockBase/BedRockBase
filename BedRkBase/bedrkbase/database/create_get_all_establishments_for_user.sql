-- Key DB logic: Establishment access for a user
-- See also: snippets.md, README.md (auth, API, DB logic)
-- Updated to avoid ambiguous user_id reference in subquery

CREATE OR REPLACE FUNCTION public.get_all_establishments_for_user(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    parent_id UUID,
    name VARCHAR,
    description VARCHAR,
    utm_zone SMALLINT,
    latitude DECIMAL,
    longitude DECIMAL,
    utm_x DECIMAL,
    utm_y DECIMAL,
    datum VARCHAR,
    long_calc DECIMAL,
    lat_calc DECIMAL,
    geom GEOGRAPHY,
    gov_id VARCHAR,
    local_id VARCHAR,
    alt_id VARCHAR,
    operating_permit_id VARCHAR,
    facility_type VARCHAR,
    naics_code VARCHAR,
    nace_code VARCHAR,
    sector_code VARCHAR,
    industry_description VARCHAR,
    capacity_mw DECIMAL,
    employees_total INTEGER,
    contact_name VARCHAR,
    contact_email VARCHAR,
    contact_phone VARCHAR,
    website_url VARCHAR,
    program_acronym VARCHAR,
    pollutant_release JSON,
    usr_defined_01 VARCHAR,
    usr_defined_02 VARCHAR,
    usr_defined_03 VARCHAR,
    usr_defined_04 VARCHAR,
    usr_defined_05 VARCHAR,
    usr_defined_06 VARCHAR,
    usr_defined_07 VARCHAR,
    usr_defined_08 VARCHAR,
    usr_defined_09 VARCHAR,
    usr_defined_10 VARCHAR,
    usr_json_defined JSON,
    upload VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    owner_id UUID
) AS $$
BEGIN
    -- Validate input
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id cannot be null';
    END IF;

    -- Fetch establishments
    RETURN QUERY
    SELECT
        e.id,
        e.parent_id,
        e.name,
        e.description,
        e.utm_zone,
        e.latitude,
        e.longitude,
        e.utm_x,
        e.utm_y,
        e.datum,
        e.long_calc,
        e.lat_calc,
        e.geom,
        e.gov_id,
        e.local_id,
        e.alt_id,
        e.operating_permit_id,
        e.facility_type,
        e.naics_code,
        e.nace_code,
        e.sector_code,
        e.industry_description,
        e.capacity_mw,
        e.employees_total,
        e.contact_name,
        e.contact_email,
        e.contact_phone,
        e.website_url,
        e.program_acronym,
        e.pollutant_release,
        e.usr_defined_01,
        e.usr_defined_02,
        e.usr_defined_03,
        e.usr_defined_04,
        e.usr_defined_05,
        e.usr_defined_06,
        e.usr_defined_07,
        e.usr_defined_08,
        e.usr_defined_09,
        e.usr_defined_10,
        e.usr_json_defined,
        e.upload,
        e.created_at,
        e.updated_at,
        e.owner_id
    FROM
        public.establishment e
    WHERE
        e.owner_id = p_user_id
        OR EXISTS (
            SELECT 1
            FROM public.establishment_access ea
            WHERE ea.establishment_id = e.id
              AND ea.user_id = p_user_id
        );

    -- Handle case where no establishments are found
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No establishments found for the given user_id';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
